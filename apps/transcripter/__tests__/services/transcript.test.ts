/**
 * Tests for TranscriptService with error handling
 */

import {
	FileOperationError,
	SubtitleParsingError,
	TranscriptNotAvailableError,
	VideoNotFoundError,
} from '@/errors';
import * as srtParser from '@/parsers/srt';
import * as vttParser from '@/parsers/vtt';
import { TranscriptService } from '@/services/transcript';
import * as filesModule from '@/utils/files';

// Mock the file utilities
jest.mock('@/utils/files');
jest.mock('@/parsers/srt');
jest.mock('@/parsers/vtt');
jest.mock('@/utils/logger');

const mockFiles = filesModule as jest.Mocked<typeof filesModule>;
const mockSrtParser = srtParser as jest.Mocked<typeof srtParser>;
const mockVttParser = vttParser as jest.Mocked<typeof vttParser>;

// Mock Bun.file
const mockBunFile = {
	text: jest.fn(),
};
(global as any).Bun = {
	file: jest.fn().mockReturnValue(mockBunFile),
};

describe('TranscriptService', () => {
	let service: TranscriptService;

	beforeEach(() => {
		service = new TranscriptService();
		jest.clearAllMocks();
	});

	describe('extractTranscript', () => {
		const videoId = 'dQw4w9WgXcQ';
		const language = 'es';
		const userId = 'user123';
		const tempDir = '/tmp/transcript_test';

		it('should successfully extract transcript', async () => {
			const mockTranscript = [
				{ start: 0, end: 5, text: 'Hello world' },
				{ start: 5, end: 10, text: 'This is a test' },
			];

			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockResolvedValue(['video.es.vtt']);
			mockFiles.selectBestSubtitleFile.mockReturnValue('video.es.vtt');
			mockBunFile.text.mockResolvedValue(
				'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nHello world',
			);
			mockVttParser.parseVTTSubtitles.mockReturnValue(mockTranscript);
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			const result = await service.extractTranscript(videoId, language, userId);

			expect(result).toEqual({
				transcript: mockTranscript,
				segments: 2,
				file: 'video.es.vtt',
			});

			expect(mockFiles.createTempDirectory).toHaveBeenCalledWith(videoId);
			expect(mockFiles.downloadSubtitles).toHaveBeenCalledWith(
				videoId,
				language,
				tempDir,
			);
			expect(mockFiles.cleanupTempDirectory).toHaveBeenCalledWith(tempDir);
		});

		it('should handle SRT files', async () => {
			const mockTranscript = [{ start: 0, end: 5, text: 'Hello world' }];

			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockResolvedValue(['video.es.srt']);
			mockFiles.selectBestSubtitleFile.mockReturnValue('video.es.srt');
			mockBunFile.text.mockResolvedValue(
				'1\n00:00:00,000 --> 00:00:05,000\nHello world',
			);
			mockSrtParser.parseSRTSubtitles.mockReturnValue(mockTranscript);
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			const result = await service.extractTranscript(videoId, language, userId);

			expect(mockSrtParser.parseSRTSubtitles).toHaveBeenCalled();
			expect(result.file).toBe('video.es.srt');
		});

		it('should propagate VideoNotFoundError', async () => {
			const error = new VideoNotFoundError(videoId);

			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockRejectedValue(error);
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			await expect(
				service.extractTranscript(videoId, language, userId),
			).rejects.toThrow(VideoNotFoundError);
		});

		it('should propagate TranscriptNotAvailableError', async () => {
			const error = new TranscriptNotAvailableError(videoId, language);

			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockRejectedValue(error);
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			await expect(
				service.extractTranscript(videoId, language, userId),
			).rejects.toThrow(TranscriptNotAvailableError);
		});

		it('should throw FileOperationError when file reading fails', async () => {
			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockResolvedValue(['video.es.vtt']);
			mockFiles.selectBestSubtitleFile.mockReturnValue('video.es.vtt');
			mockBunFile.text.mockRejectedValue(new Error('File not found'));
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			await expect(
				service.extractTranscript(videoId, language, userId),
			).rejects.toThrow(FileOperationError);
		});

		it('should throw SubtitleParsingError when parsing fails', async () => {
			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockResolvedValue(['video.es.vtt']);
			mockFiles.selectBestSubtitleFile.mockReturnValue('video.es.vtt');
			mockBunFile.text.mockResolvedValue('WEBVTT\n\ninvalid content');
			mockVttParser.parseVTTSubtitles.mockImplementation(() => {
				throw new Error('Invalid VTT format');
			});
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			await expect(
				service.extractTranscript(videoId, language, userId),
			).rejects.toThrow(SubtitleParsingError);
		});

		it('should always cleanup temp directory even on error', async () => {
			const error = new VideoNotFoundError(videoId);

			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockRejectedValue(error);
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			await expect(
				service.extractTranscript(videoId, language, userId),
			).rejects.toThrow();

			expect(mockFiles.cleanupTempDirectory).toHaveBeenCalledWith(tempDir);
		});

		it('should work without userId', async () => {
			const mockTranscript = [{ start: 0, end: 5, text: 'Hello world' }];

			mockFiles.createTempDirectory.mockResolvedValue(tempDir);
			mockFiles.downloadSubtitles.mockResolvedValue(['video.es.vtt']);
			mockFiles.selectBestSubtitleFile.mockReturnValue('video.es.vtt');
			mockBunFile.text.mockResolvedValue(
				'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nHello world',
			);
			mockVttParser.parseVTTSubtitles.mockReturnValue(mockTranscript);
			mockFiles.cleanupTempDirectory.mockResolvedValue();

			const result = await service.extractTranscript(videoId, language);

			expect(result).toBeDefined();
			expect(result.transcript).toEqual(mockTranscript);
		});
	});
});

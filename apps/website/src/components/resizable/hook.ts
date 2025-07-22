import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedEffect } from '@/hooks/debounce';

interface UseResizableSidebarProps {
	initialWidth?: number;
	minWidth?: number;
	maxWidth?: number;
	storageKey?: string;
	debounceDelay?: number;
}

// Helper functions for localStorage
const getStoredWidth = (key: string, fallback: number): number => {
	if (typeof window === 'undefined') return fallback;

	try {
		const stored = localStorage.getItem(key);
		if (stored) {
			const parsed = Number.parseInt(stored, 10);
			return Number.isNaN(parsed) ? fallback : parsed;
		}
	} catch (error) {
		console.warn('Failed to read sidebar width from localStorage:', error);
	}

	return fallback;
};

const setStoredWidth = (key: string, width: number): void => {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(key, width.toString());
	} catch (error) {
		console.warn('Failed to save sidebar width to localStorage:', error);
	}
};

export function useResizableSidebar({
	initialWidth = 300,
	minWidth = 200,
	maxWidth = 600,
	storageKey = 'resizable-sidebar-width',
	debounceDelay = 500,
}: UseResizableSidebarProps = {}) {
	// Initialize width from localStorage or fallback to initialWidth
	const [sidebarWidth, setSidebarWidth] = useState(() =>
		getStoredWidth(storageKey, initialWidth),
	);
	const [isResizing, setIsResizing] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const startXRef = useRef(0);
	const startWidthRef = useRef(0);

	// Debounced effect to save width to localStorage
	useDebouncedEffect(
		() => {
			setStoredWidth(storageKey, sidebarWidth);
		},
		[sidebarWidth, storageKey],
		debounceDelay,
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			setIsResizing(true);
			startXRef.current = e.clientX;
			startWidthRef.current = sidebarWidth;

			// Add cursor style to body
			document.body.style.cursor = 'col-resize';
			document.body.style.userSelect = 'none';
		},
		[sidebarWidth],
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing) return;

			const deltaX = e.clientX - startXRef.current;
			const newWidth = startWidthRef.current - deltaX; // Subtract because we're dragging from right edge

			// Clamp the width between min and max
			const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
			setSidebarWidth(clampedWidth);
		},
		[isResizing, minWidth, maxWidth],
	);

	const handleMouseUp = useCallback(() => {
		if (!isResizing) return;

		setIsResizing(false);

		// Remove cursor style from body
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	}, [isResizing]);

	// Add global mouse events
	useEffect(() => {
		if (isResizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);

			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isResizing, handleMouseMove, handleMouseUp]);

	// Calculate grid column widths
	const mainWidth = `calc(100% - ${sidebarWidth}px)`;
	const sidebarWidthPx = `${sidebarWidth}px`;

	return {
		sidebarWidth,
		isResizing,
		sidebarRef,
		handleMouseDown,
		mainWidth,
		sidebarWidthPx,
	};
}

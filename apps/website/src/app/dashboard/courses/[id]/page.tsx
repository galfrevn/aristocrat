'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect, useParams } from 'next/navigation';
import { ContentRootBody } from '@/app/dashboard/courses/[id]/components/body';
import { ContentRootHeader } from '@/app/dashboard/courses/[id]/components/header';
import { CourseContentProgressProvider } from '@/app/dashboard/courses/[id]/components/hooks';
import { ContentRootSidebar } from '@/app/dashboard/courses/[id]/components/sidebar';
import { ContentRootSkeleton } from '@/app/dashboard/courses/[id]/components/skeleton';
import { CourseVideo } from '@/app/dashboard/courses/[id]/components/video';
import { ResizableHandle } from '@/components/resizable/handle';
import { useResizableSidebar } from '@/components/resizable/hook';
import {
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/resizable/parts';
import { trpc } from '@/utils/trpc';

export default function AristocratCourseContentPage() {
	const { id } = useParams();
	const course = useQuery({
		...trpc.courses.$get.content.queryOptions({
			courseId: id as string,
		}),
	});

	const { isResizing, sidebarRef, handleMouseDown, mainWidth, sidebarWidthPx } =
		useResizableSidebar({
			storageKey: 'course:content:sidebar:size',
			debounceDelay: 500,
			initialWidth: 350,
			minWidth: 250,
			maxWidth: 600,
		});

	if (course.isPending) {
		return <ContentRootSkeleton />;
	}

	if (!course.data) {
		return redirect('/dashboard/courses');
	}

	return (
		<CourseContentProgressProvider
			defaultLessonId={course.data?.chapters[0]?.lessons[0]?.id}
		>
			<ContentRootHeader title={course.data.title} />
			<ResizablePanelGroup>
				<div className="flex flex-col" style={{ width: mainWidth }}>
					<CourseVideo />
					<section className="p-8">
						<ContentRootBody />
					</section>
				</div>

				<ResizablePanel
					resizableRef={sidebarRef}
					resizableWidth={sidebarWidthPx}
				>
					<ResizableHandle
						onMouseDown={handleMouseDown}
						isResizing={isResizing}
					/>
					{/* @ts-expect-error - TODO: fix this */}
					<ContentRootSidebar chapters={course.data.chapters} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</CourseContentProgressProvider>
	);
}

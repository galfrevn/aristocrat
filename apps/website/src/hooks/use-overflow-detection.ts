'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to detect if content overflows its container and set a data attribute
 * This is used to dynamically adjust border radius when content scrolls
 */
export function useOverflowDetection() {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = contentRef.current;
		if (!element) return;

		const checkOverflow = () => {
			const hasVerticalOverflow = element.scrollHeight > element.clientHeight;
			const hasHorizontalOverflow = element.scrollWidth > element.clientWidth;
			const hasOverflow = hasVerticalOverflow || hasHorizontalOverflow;

			element.setAttribute('data-overflow', hasOverflow.toString());
		};

		checkOverflow();

		const resizeObserver = new ResizeObserver(() => {
			checkOverflow();
		});

		resizeObserver.observe(element);

		const mutationObserver = new MutationObserver(() => {
			checkOverflow();
		});

		mutationObserver.observe(element, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['style', 'class'],
		});

		const handleScroll = () => {
			checkOverflow();
		};

		let parent = element.parentElement;
		const scrollableParents: Element[] = [];

		while (parent) {
			const overflowY = window.getComputedStyle(parent).overflowY;
			const overflowX = window.getComputedStyle(parent).overflowX;

			if (
				overflowY === 'scroll' ||
				overflowY === 'auto' ||
				overflowX === 'scroll' ||
				overflowX === 'auto'
			) {
				scrollableParents.push(parent);
				parent.addEventListener('scroll', handleScroll);
			}
			parent = parent.parentElement;
		}

		window.addEventListener('scroll', handleScroll);

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			scrollableParents.forEach((parent) => {
				parent.removeEventListener('scroll', handleScroll);
			});
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return contentRef;
}

'use client';

import { createContext, useContext, useState } from 'react';

import type { Layout } from '@/types/layout';

interface AristocratCoursesSearchContextValue {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const AristocratCoursesSearchContext =
	createContext<AristocratCoursesSearchContextValue | null>(null);

interface AristocratCoursesSearchWrapperProps extends Layout {}

export const AristocratCoursesSearchWrapper = (
	props: AristocratCoursesSearchWrapperProps,
) => {
	const { children } = props;
	const [searchQuery, setSearchQuery] = useState('');

	const contextValue: AristocratCoursesSearchContextValue = {
		searchQuery,
		setSearchQuery,
	};

	return (
		<AristocratCoursesSearchContext.Provider value={contextValue}>
			<div className="space-y-8">{children}</div>
		</AristocratCoursesSearchContext.Provider>
	);
};

export const useAristocratCoursesSearch = () => {
	const context = useContext(AristocratCoursesSearchContext);

	if (!context) {
		throw new Error(
			'useAristocratCoursesSearch must be used within AristocratCoursesSearchWrapper',
		);
	}

	return context;
};

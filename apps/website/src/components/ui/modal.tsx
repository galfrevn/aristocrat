'use client';

import { motion } from 'motion/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

// Animation variants
const dialogVariants = {
	hidden: {
		scale: 0.8,
		opacity: 0,
		y: 20,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
		},
	},
	visible: {
		scale: 1,
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
			mass: 0.8,
			staggerChildren: 0.07,
			delayChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: {
		y: 20,
		opacity: 0,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
		},
	},
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
			mass: 0.8,
		},
	},
};

// SmoothModal Context
interface SmoothModalContextType {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const SmoothModalContext = React.createContext<
	SmoothModalContextType | undefined
>(undefined);

// SmoothModal Root Component
interface SmoothModalProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function SmoothModal({
	children,
	open: controlledOpen,
	onOpenChange,
}: SmoothModalProps) {
	const [internalOpen, setInternalOpen] = React.useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled ? onOpenChange || (() => {}) : setInternalOpen;

	return (
		<SmoothModalContext.Provider value={{ open, onOpenChange: setOpen }}>
			<Dialog open={open} onOpenChange={setOpen}>
				{children}
			</Dialog>
		</SmoothModalContext.Provider>
	);
}

// SmoothModal Trigger
interface SmoothModalTriggerProps {
	children: React.ReactNode;
	asChild?: boolean;
}

export function SmoothModalTrigger({
	children,
	asChild = false,
}: SmoothModalTriggerProps) {
	return <DialogTrigger asChild={asChild}>{children}</DialogTrigger>;
}

// SmoothModal Content
interface SmoothModalContentProps {
	children: React.ReactNode;
	className?: string;
	enableHeightAnimation?: boolean;
}

export function SmoothModalContent({
	children,
	className = '',
	enableHeightAnimation = true,
}: SmoothModalContentProps) {
	return (
		<DialogContent className="max-w-[380px] overflow-hidden border-0 bg-transparent p-0 shadow-none">
			<motion.div
				variants={dialogVariants}
				initial="hidden"
				animate="visible"
				layout={enableHeightAnimation}
				transition={{
					layout: {
						type: 'spring',
						stiffness: 300,
						damping: 30,
						mass: 0.8,
					},
				}}
				className={`space-y-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
			>
				{children}
			</motion.div>
		</DialogContent>
	);
}

// SmoothModal Header
interface SmoothModalHeaderProps {
	children: React.ReactNode;
	className?: string;
}

export function SmoothModalHeader({
	children,
	className = '',
}: SmoothModalHeaderProps) {
	return (
		<motion.div variants={itemVariants}>
			<DialogHeader className={`px-0 ${className}`}>{children}</DialogHeader>
		</motion.div>
	);
}

// SmoothModal Title
interface SmoothModalTitleProps {
	children: React.ReactNode;
	className?: string;
	logo?: React.ReactNode;
}

export function SmoothModalTitle({
	children,
	className = '',
	logo,
}: SmoothModalTitleProps) {
	return (
		<DialogTitle
			className={`flex items-center gap-2.5 font-medium text-2xl ${className}`}
		>
			{logo}
			<motion.span variants={itemVariants}>{children}</motion.span>
		</DialogTitle>
	);
}

// SmoothModal Description
interface SmoothModalDescriptionProps {
	children: React.ReactNode;
	className?: string;
}

export function SmoothModalDescription({
	children,
	className = '',
}: SmoothModalDescriptionProps) {
	return (
		<motion.div variants={itemVariants}>
			<DialogDescription
				className={`font-sans text-muted-foreground text-sm ${className}`}
			>
				{children}
			</DialogDescription>
		</motion.div>
	);
}

// SmoothModal Body (for custom content)
interface SmoothModalBodyProps {
	children: React.ReactNode;
	className?: string;
}

export function SmoothModalBody({
	children,
	className = 'font-sans',
}: SmoothModalBodyProps) {
	return (
		<motion.div variants={itemVariants} className={className}>
			{children}
		</motion.div>
	);
}

// SmoothModal Footer (for actions)
interface SmoothModalFooterProps {
	children: React.ReactNode;
	className?: string;
}

export function SmoothModalFooter({
	children,
	className = '',
}: SmoothModalFooterProps) {
	return (
		<motion.div
			variants={itemVariants}
			className={`flex flex-col gap-3 ${className}`}
		>
			{children}
		</motion.div>
	);
}

// SmoothTabs Context for state management
interface SmoothTabsContextType {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	direction: number;
}

const SmoothTabsContext = React.createContext<
	SmoothTabsContextType | undefined
>(undefined);

const useSmoothTabs = () => {
	const context = React.useContext(SmoothTabsContext);
	if (!context) {
		throw new Error('SmoothTabs components must be used within a SmoothTabs');
	}
	return context;
};

// Tab animation variants
const tabVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 100 : -100,
		opacity: 0,
		scale: 0.95,
	}),
	center: {
		x: 0,
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
			mass: 0.8,
		},
	},
	exit: (direction: number) => ({
		x: direction < 0 ? 100 : -100,
		opacity: 0,
		scale: 0.95,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
			mass: 0.8,
		},
	}),
};

const tabListVariants = {
	hidden: {
		opacity: 0,
		y: -10,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
			staggerChildren: 0.05,
		},
	},
};

const tabTriggerVariants = {
	hidden: {
		opacity: 0,
		y: -5,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring' as const,
			stiffness: 300,
			damping: 30,
		},
	},
};

// SmoothTabs Root Component
interface SmoothTabsProps<T> {
	children: React.ReactNode;
	value?: string;
	onValueChange?: (value: T) => void;
	defaultValue?: string;
	className?: string;
}

export function SmoothTabs<T>({
	children,
	value: controlledValue,
	onValueChange,
	defaultValue = '',
	className = '',
}: SmoothTabsProps<T>) {
	const [internalValue, setInternalValue] = React.useState(defaultValue);
	const [direction, setDirection] = React.useState(0);
	const tabsRef = React.useRef<string[]>([]);

	const isControlled = controlledValue !== undefined;
	const value = isControlled ? controlledValue : internalValue;

	const setValue = React.useCallback(
		(newValue: string) => {
			const currentIndex = tabsRef.current.indexOf(value);
			const newIndex = tabsRef.current.indexOf(newValue);
			setDirection(newIndex > currentIndex ? 1 : -1);

			if (isControlled) {
				onValueChange?.(newValue as T);
			} else {
				setInternalValue(newValue);
			}
		},
		[value, isControlled, onValueChange],
	);

	const registerTab = React.useCallback((tabValue: string) => {
		if (!tabsRef.current.includes(tabValue)) {
			tabsRef.current.push(tabValue);
		}
	}, []);

	return (
		<SmoothTabsContext.Provider
			value={{
				activeTab: value,
				setActiveTab: setValue,
				direction,
			}}
		>
			<div className={`w-full ${className}`}>
				{React.Children.map(children, (child) => {
					if (React.isValidElement(child) && child.type === SmoothTabContent) {
						const props = child.props as { value: string };
						registerTab(props.value);
					}
					return child;
				})}
			</div>
		</SmoothTabsContext.Provider>
	);
}

// SmoothTabs List (Navigation)
interface SmoothTabsListProps {
	children: React.ReactNode;
	className?: string;
}

export function SmoothTabsList({
	children,
	className = '',
}: SmoothTabsListProps) {
	return (
		<motion.div
			variants={tabListVariants}
			initial="hidden"
			animate="visible"
			className={`flex rounded-lg bg-muted p-1 text-muted-foreground ${className}`}
		>
			{children}
		</motion.div>
	);
}

// SmoothTabs Trigger (Tab Button)
interface SmoothTabsTriggerProps {
	children: React.ReactNode;
	value: string;
	className?: string;
	disabled?: boolean;
}

export function SmoothTabsTrigger({
	children,
	value,
	className = '',
	disabled = false,
}: SmoothTabsTriggerProps) {
	const { activeTab, setActiveTab } = useSmoothTabs();
	const isActive = activeTab === value;

	return (
		<motion.button
			variants={tabTriggerVariants}
			type="button"
			disabled={disabled}
			onClick={() => !disabled && setActiveTab(value)}
			className={`relative flex-1 whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50${
				isActive
					? 'bg-background text-foreground shadow-sm'
					: 'hover:bg-background/60 hover:text-foreground'
			}
				${className}
			`}
			whileHover={{ scale: disabled ? 1 : 1.02 }}
			whileTap={{ scale: disabled ? 1 : 0.98 }}
		>
			{isActive && (
				<motion.div
					layoutId="smooth-tab-indicator"
					className="absolute inset-0 rounded-md bg-background shadow-sm"
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 30,
					}}
				/>
			)}
			<span className="relative z-10">{children}</span>
		</motion.button>
	);
}

// SmoothTabs Content (Tab Panel)
interface SmoothTabContentProps {
	children: React.ReactNode;
	value: string;
	className?: string;
}

export function SmoothTabContent({
	children,
	value,
	className = '',
}: SmoothTabContentProps) {
	const { activeTab, direction } = useSmoothTabs();
	const isActive = activeTab === value;

	if (!isActive) return null;

	return (
		<motion.div
			key={value}
			custom={direction}
			variants={tabVariants}
			initial="enter"
			animate="center"
			exit="exit"
			layout
			transition={{
				layout: {
					type: 'spring',
					stiffness: 300,
					damping: 30,
					mass: 0.8,
				},
			}}
			className={`mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
		>
			{children}
		</motion.div>
	);
}

// SmoothTabs Navigation Controls
interface SmoothTabsNavigationProps<T> {
	children?: React.ReactNode;
	className?: string;
	showPrevious?: boolean;
	showNext?: boolean;
	previousLabel?: string;
	nextLabel?: string;
	onPrevious?: () => void;
	onNext?: () => void;
	onValidateStep?: (currentStep: T) => Promise<boolean> | boolean;
	tabs?: string[];
	isValidating?: boolean;
}

export function SmoothTabsNavigation<T>({
	children,
	className = '',
	showPrevious = true,
	showNext = true,
	previousLabel = 'Previous',
	nextLabel = 'Next',
	onPrevious,
	onNext,
	onValidateStep,
	tabs = [],
	isValidating = false,
}: SmoothTabsNavigationProps<T>) {
	const { activeTab, setActiveTab } = useSmoothTabs();
	const [validatingNext, setValidatingNext] = React.useState(false);

	const currentIndex = tabs.indexOf(activeTab);
	const canGoPrevious = currentIndex > 0;
	const canGoNext = currentIndex < tabs.length - 1;

	const handlePrevious = () => {
		if (onPrevious) {
			onPrevious();
		} else if (canGoPrevious) {
			setActiveTab(tabs[currentIndex - 1]);
		}
	};

	const handleNext = async () => {
		// If there's a validation function, validate the current step first
		if (onValidateStep) {
			setValidatingNext(true);
			try {
				const isValid = await onValidateStep(activeTab as T);
				if (!isValid) {
					setValidatingNext(false);
					return; // Don't proceed if validation fails
				}
			} catch (error) {
				console.error('Validation error:', error);
				setValidatingNext(false);
				return;
			}
			setValidatingNext(false);
		}

		// If not the last step, just navigate without calling onNext
		if (!isLastStep) {
			if (canGoNext) {
				setActiveTab(tabs[currentIndex + 1]);
			}
			return;
		}

		// Proceed with navigation
		if (onNext) {
			onNext();
		} else if (canGoNext) {
			setActiveTab(tabs[currentIndex + 1]);
		}
	};

	const isLastStep = currentIndex === tabs.length - 1;
	const isNextDisabled =
		(!canGoNext && !isLastStep) || validatingNext || isValidating;

	return (
		<motion.div
			variants={itemVariants}
			className={`flex justify-between gap-2 ${className}`}
		>
			{showPrevious && (
				<Button
					type="button"
					variant="outline"
					onClick={handlePrevious}
					disabled={!canGoPrevious || validatingNext || isValidating}
					className="flex-1 font-sans"
				>
					{previousLabel}
				</Button>
			)}

			{children}

			{showNext && (
				<Button
					type="button"
					onClick={handleNext}
					disabled={isNextDisabled}
					className="flex-1 font-sans"
				>
					{validatingNext ? 'Validating...' : nextLabel}
				</Button>
			)}
		</motion.div>
	);
}

// Export default for backward compatibility - simple usage example
interface DrawerDemoProps {
	title?: string;
	description?: string;
	triggerText?: string;
	children?: React.ReactNode;
}

export default function SmoothDrawer({
	title = 'SmoothModal Demo',
	description = 'This is a demo of the SmoothModal component',
	triggerText = 'Open Modal',
	children,
}: DrawerDemoProps) {
	return (
		<SmoothModal>
			<SmoothModalTrigger asChild>
				<Button variant="outline">{triggerText}</Button>
			</SmoothModalTrigger>
			<SmoothModalContent>
				{children || (
					<>
						<SmoothModalHeader>
							<SmoothModalTitle>{title}</SmoothModalTitle>
							<SmoothModalDescription>{description}</SmoothModalDescription>
						</SmoothModalHeader>
						<SmoothModalBody>
							<p>Add your custom content here.</p>
						</SmoothModalBody>
						<SmoothModalFooter>
							<Button className="w-full">Close</Button>
						</SmoothModalFooter>
					</>
				)}
			</SmoothModalContent>
		</SmoothModal>
	);
}

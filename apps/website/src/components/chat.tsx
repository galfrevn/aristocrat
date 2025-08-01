'use client';

import { SettingsPanelTrigger } from '@/components/settings-panel';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	RiCodeSSlashLine,
	RiShareLine,
	RiShareCircleLine,
	RiShining2Line,
	RiAttachment2,
	RiMicLine,
	RiLeafLine,
} from '@remixicon/react';
import { ChatMessage } from '@/components/chat-message';
import { useRef, useEffect } from 'react';

export default function Chat() {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView();
	}, []);

	return (
		<ScrollArea className="w-full flex-1 bg-background shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl [&>div>div]:h-full">
			<div className="flex h-full flex-col px-4 md:px-6 lg:px-8">
				{/* Header */}
				<div className="sticky top-0 z-10 bg-background py-5 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
					<div className="flex items-center justify-between gap-2">
						<Breadcrumb>
							<BreadcrumbList className="sm:gap-1.5">
								<BreadcrumbItem>
									<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Chat</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<div className="-my-2 -me-2 flex items-center gap-1">
							<Button variant="ghost" className="px-2">
								<RiCodeSSlashLine
									className="size-5 text-muted-foreground sm:text-muted-foreground/70"
									size={20}
									aria-hidden="true"
								/>
								<span className="max-sm:sr-only">Code</span>
							</Button>
							<Button variant="ghost" className="px-2">
								<RiShareLine
									className="size-5 text-muted-foreground sm:text-muted-foreground/70"
									size={20}
									aria-hidden="true"
								/>
								<span className="max-sm:sr-only">Share</span>
							</Button>
							<Button variant="ghost" className="px-2">
								<RiShareCircleLine
									className="size-5 text-muted-foreground sm:text-muted-foreground/70"
									size={20}
									aria-hidden="true"
								/>
								<span className="max-sm:sr-only">Export</span>
							</Button>
							<SettingsPanelTrigger />
						</div>
					</div>
				</div>
				{/* Chat */}
				<div className="relative grow">
					<div className="mx-auto mt-6 max-w-3xl space-y-6">
						<div className="my-8 text-center">
							<div className="inline-flex items-center rounded-full border border-black/[0.08] bg-white px-3 py-1 font-medium text-foreground/80 text-xs shadow-xs">
								<RiShining2Line
									className="-ms-1 me-1.5 text-muted-foreground/70"
									size={14}
									aria-hidden="true"
								/>
								Today
							</div>
						</div>
						<ChatMessage isUser>
							<p>Hey Bolt, can you tell me more about AI Agents?</p>
						</ChatMessage>
						<ChatMessage>
							<p>
								AI agents are software that perceive their environment and act
								autonomously to achieve goals, making decisions, learning, and
								interacting. For example, an AI agent might schedule meetings by
								resolving conflicts, contacting participants, and finding
								optimal times—all without constant supervision.
							</p>
							<p>Let me know if you&lsquo;d like more details!</p>
						</ChatMessage>
						<ChatMessage isUser>
							<p>All clear, thank you!</p>
						</ChatMessage>
						<div ref={messagesEndRef} aria-hidden="true" />
					</div>
				</div>
				{/* Footer */}
				<div className="sticky bottom-0 z-50 pt-4 md:pt-8">
					<div className="mx-auto max-w-3xl rounded-[20px] bg-background pb-4 md:pb-8">
						<div className="relative rounded-[20px] border border-transparent bg-muted transition-colors focus-within:border-input focus-within:bg-muted/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
							<textarea
								className="flex w-full bg-transparent px-4 py-3 text-[15px] text-foreground leading-relaxed [resize:none] placeholder:text-muted-foreground/70 focus-visible:outline-none sm:min-h-[84px]"
								placeholder="Ask me anything..."
								aria-label="Enter your prompt"
							/>
							{/* Textarea buttons */}
							<div className="flex items-center justify-between gap-2 p-3">
								{/* Left buttons */}
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="icon"
										className="size-8 rounded-full border-none transition-[box-shadow] hover:bg-background hover:shadow-md"
									>
										<RiAttachment2
											className="size-5 text-muted-foreground/70"
											size={20}
											aria-hidden="true"
										/>
										<span className="sr-only">Attach</span>
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="size-8 rounded-full border-none transition-[box-shadow] hover:bg-background hover:shadow-md"
									>
										<RiMicLine
											className="size-5 text-muted-foreground/70"
											size={20}
											aria-hidden="true"
										/>
										<span className="sr-only">Audio</span>
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="size-8 rounded-full border-none transition-[box-shadow] hover:bg-background hover:shadow-md"
									>
										<RiLeafLine
											className="size-5 text-muted-foreground/70"
											size={20}
											aria-hidden="true"
										/>
										<span className="sr-only">Action</span>
									</Button>
								</div>
								{/* Right buttons */}
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="icon"
										className="size-8 rounded-full border-none transition-[box-shadow] hover:bg-background hover:shadow-md"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="none"
										>
											<title>Generate Icon</title>
											<g clipPath="url(#icon-a)">
												<path
													fill="url(#icon-b)"
													d="m8 .333 2.667 5 5 2.667-5 2.667-2.667 5-2.667-5L.333 8l5-2.667L8 .333Z"
												/>
												<path
													stroke="#451A03"
													strokeOpacity=".04"
													d="m8 1.396 2.225 4.173.072.134.134.071L14.604 8l-4.173 2.226-.134.071-.072.134L8 14.604l-2.226-4.173-.071-.134-.134-.072L1.396 8l4.173-2.226.134-.071.071-.134L8 1.396Z"
												/>
											</g>
											<defs>
												<linearGradient
													id="icon-b"
													x1="8"
													x2="8"
													y1=".333"
													y2="15.667"
													gradientUnits="userSpaceOnUse"
												>
													<stop stopColor="#FDE68A" />
													<stop offset="1" stopColor="#F59E0B" />
												</linearGradient>
												<clipPath id="icon-a">
													<path fill="#fff" d="M0 0h16v16H0z" />
												</clipPath>
											</defs>
										</svg>
										<span className="sr-only">Generate</span>
									</Button>
									<Button className="h-8 rounded-full">Ask Bart</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}

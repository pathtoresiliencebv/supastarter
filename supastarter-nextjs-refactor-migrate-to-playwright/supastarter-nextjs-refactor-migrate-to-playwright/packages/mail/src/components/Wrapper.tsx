import {
	Container,
	Font,
	Head,
	Html,
	Section,
	Tailwind,
} from "@react-email/components";
import { lightVariables } from "@repo/tailwind-config";
import React, { type PropsWithChildren } from "react";
import { Logo } from "./Logo";

export default function Wrapper({ children }: PropsWithChildren) {
	return (
		<Html lang="en">
			<Head>
				<Font
					fontFamily="Inter"
					fallbackFontFamily="Arial"
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								border: lightVariables.colors.border,
								input: lightVariables.colors.input,
								ring: lightVariables.colors.ring,
								background: lightVariables.colors.background,
								foreground: lightVariables.colors.foreground,
								primary: {
									DEFAULT: lightVariables.colors.primary,
									foreground: lightVariables.colors["primary-foreground"],
								},
								secondary: {
									DEFAULT: lightVariables.colors.secondary,
									foreground: lightVariables.colors["secondary-foreground"],
								},
								destructive: {
									DEFAULT: lightVariables.colors.destructive,
									foreground: lightVariables.colors["destructive-foreground"],
								},
								success: {
									DEFAULT: lightVariables.colors.success,
									foreground: lightVariables.colors["success-foreground"],
								},
								muted: {
									DEFAULT: lightVariables.colors.muted,
									foreground: lightVariables.colors["muted-foreground"],
								},
								accent: {
									DEFAULT: lightVariables.colors.accent,
									foreground: lightVariables.colors["accent-foreground"],
								},
								popover: {
									DEFAULT: lightVariables.colors.popover,
									foreground: lightVariables.colors["popover-foreground"],
								},
								card: {
									DEFAULT: lightVariables.colors.card,
									foreground: lightVariables.colors["card-foreground"],
								},
							},
						},
					},
				}}
			>
				<Section className="bg-background p-4">
					<Container className="rounded-lg bg-card p-6 text-card-foreground">
						<Logo />
						{children}
					</Container>
				</Section>
			</Tailwind>
		</Html>
	);
}

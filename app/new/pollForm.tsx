"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { POLL_TYPES, PollType } from "@/lib/poll";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const pollSchema = z.object({
	title: z.string(),
	description: z.string(),
	type: z.enum(POLL_TYPES),
	options: z.array(z.object({
		text: z.string(),
	})),
	maxLength: z.number(),
});

type PollSchema = z.infer<typeof pollSchema>;

export default function PollForm() {
	const form = useForm<PollSchema>({
		defaultValues: {
			title: "",
			description: "",
			type: "SINGLE_CHOICE",
			options: [{ text: "" }],
			maxLength: 0,
		},
		resolver: zodResolver(pollSchema),
	});

	const onSubmit = (data: PollSchema) => {
		console.log(data);
	}

	const options = useFieldArray({
		control: form.control,
		name: "options",
	});

	const isChoice = form.watch("type") === "MULTIPLE_CHOICE" || form.watch("type") === "SINGLE_CHOICE";
	const isText = form.watch("type") === "TEXT";


	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Title" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="Description" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value={"SINGLE_CHOICE"}>Single Choice</SelectItem>
									<SelectItem value={"MULTIPLE_CHOICE"}>Multiple Choice</SelectItem>
									<SelectItem value={"TEXT"}>Text</SelectItem>
								</SelectContent>
							</Select>

						</FormItem>
					)}
				/>
				{
					isChoice && (
						options.fields.map((option, index) => (
							<FormField
								key={option.id}
								control={form.control}
								name={`options.${index}.text`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Option {index + 1}</FormLabel>
										<FormControl>
											<Input placeholder="Option" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						))
					)
				}
				{
					isChoice && (
						<Button type="button" onClick={() => options.append({ text: "" })}>Add Option</Button>
					)
				}
				{
					isText && (
						<FormField
							control={form.control}
							name="maxLength"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Max Length</FormLabel>
									<FormControl>
										<Input type="number" placeholder="Max Length" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					)
				}

			</form>
		</Form>
	)

}
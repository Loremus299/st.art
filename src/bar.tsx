import { useForm } from "react-hook-form";
import { Sidebar, SidebarContent, SidebarGroup } from "./components/ui/sidebar";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormController from "./components/badcn/formController";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockCheckIcon, ImageAdd02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { cn } from "cn";

export default function AppBar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="grid gap-2">
          <Background />
          <ClockFormatForm />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function Background() {
  const [currentOption, setCurrentOption] = useState<
    "unsplash" | "image" | "url"
  >("image");
  return (
    <div className="grid gap-2">
      Background Image.
      <p className="text-sm text-muted-foreground">
        Refresh after adding image.
      </p>
      <div className="flex border p-1 rounded-full">
        <Button
          variant={"secondary"}
          size={"xs"}
          className={cn(currentOption === "unsplash" ? "bg-primary/10" : "")}
          onClick={() => setCurrentOption("unsplash")}
        >
          unsplash
        </Button>
        <Button
          variant={"secondary"}
          size={"xs"}
          className={cn(currentOption === "image" ? "bg-primary/10" : "")}
          onClick={() => setCurrentOption("image")}
        >
          image
        </Button>
        <Button
          variant={"secondary"}
          size={"xs"}
          className={cn(currentOption === "url" ? "bg-primary/10" : "")}
          onClick={() => setCurrentOption("url")}
        >
          url
        </Button>
      </div>
      {currentOption === "url" && <ImageLinkForm />}
    </div>
  );
}

function ImageLinkForm() {
  const schema = z.object({
    url: z.string().min(1),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { url: "" },
  });

  const onSubmit = (v: z.infer<typeof schema>) => {
    localStorage.setItem("image", v.url);
    localStorage.setItem("image-type", "url");
  };

  return (
    <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
      <FormController
        form={form}
        label="Link to Image."
        name="url"
        render={({ field, fieldState }) => (
          <Input
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder="https://www..."
            {...field}
          />
        )}
      />
      <Button type="submit">
        <HugeiconsIcon icon={ImageAdd02Icon} />
        Set Image.
      </Button>
    </form>
  );
}

function ClockFormatForm() {
  const schema = z.object({
    format: z.string().min(1),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { format: "" },
  });

  const onSubmit = (v: z.infer<typeof schema>) => {
    localStorage.setItem("clock-format", v.format);
  };

  return (
    <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
      <FormController
        form={form}
        label="Clock Format."
        name="format"
        description="YMD for date, Hms for time."
        render={({ field, fieldState }) => (
          <Input
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder="YYYY-MM-DD HH:mm:ss"
            {...field}
          />
        )}
      />
      <Button type="submit">
        <HugeiconsIcon icon={ClockCheckIcon} />
        Set Clock Format.
      </Button>
    </form>
  );
}

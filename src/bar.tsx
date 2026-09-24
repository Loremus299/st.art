import { useForm } from "react-hook-form";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
} from "./components/ui/sidebar";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormController from "./components/badcn/formController";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockCheckIcon } from "@hugeicons/core-free-icons";

export default function AppBar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="tracking-tight">Formatting st.art.</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ClockFormatForm />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
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

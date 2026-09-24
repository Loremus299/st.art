import { useEffect, useRef, useState } from "react";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";
import { Button, buttonVariants } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ImageInput from "./imageInput";
import "./colorPicker.css";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type Props = {
  defaultColorHex?: string;
  alpha?: boolean;
  preset?: string[];
  editablePresets?: boolean;
  onPresetChange?: (preset: string[]) => void;
  onPick?: (final: string) => void;
};

export default function ColorPicker({
  defaultColorHex = "#000000",
  alpha = true,
  preset = ["#f49595", " 	#f9eb97", "#c6f9ac", "#a8d9f6", "#e2bbfd"],
  editablePresets = true,
  onPresetChange = () => {},
  onPick = () => {},
}: Props) {
  const [color, setColor] = useState(defaultColorHex);
  const [presets, setPresets] = useState(preset);
  const [image, setImage] = useState<string | undefined>(undefined);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canvasAvailable, setCanvasAvailable] = useState(false);

  useEffect(() => {
    if (!image || !canvas.current) return;

    const img = new Image();

    img.src = image;

    img.onload = () => {
      const ctx = canvas.current?.getContext("2d");

      if (!ctx || !canvas.current) return;

      canvas.current.width = img.naturalWidth;
      canvas.current.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);
    };
  }, [image, canvasAvailable]);

  return (
    <div className="w-full p-4 bg-muted rounded-xl border flex flex-col gap-2">
      {alpha ? (
        <HexAlphaColorPicker
          color={color}
          onChange={setColor}
          className="color-picker w-full! h-full! aspect-video"
        />
      ) : (
        <HexColorPicker
          color={color}
          onChange={setColor}
          className="color-picker w-full! h-full! aspect-video"
        />
      )}
      <div className="grid grid-cols-2 items-center gap-2">
        <Input
          value={color}
          style={{ backgroundColor: color }}
          onChange={(e) => {
            setColor(e.currentTarget.value);
          }}
          className="border-2 border-foreground h-8.5 font-mono"
        />
        <Dialog>
          <DialogTrigger
            className={cn(buttonVariants({ size: "lg" }), "h-8.5")}
          >
            From image.
          </DialogTrigger>
          <DialogContent>
            <ImageInput
              showPreview={false}
              accepts={["image/png", "image/jpeg", "image/webp"]}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) {
                  setImage(URL.createObjectURL(file));
                }
              }}
            />
            {image && (
              <canvas
                ref={(el) => {
                  canvas.current = el;
                  setCanvasAvailable(!!el);
                }}
                className="w-full cursor-crosshair rounded-xl border border-dashed p-1"
                onMouseEnter={() => {
                  let indicator = document.getElementById(
                    "color-picker-preview-dont-use-this-id-for-anything-else-hopefully-or-doom-will-come-for-your-loved-ones",
                  );
                  if (!indicator) {
                    indicator = document.createElement("div");
                    indicator.id =
                      "color-picker-preview-dont-use-this-id-for-anything-else-hopefully-or-doom-will-come-for-your-loved-ones";
                    indicator.className =
                      "fixed size-8 rounded-full border-2 border-foreground shadow-md pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2";
                    document.body.appendChild(indicator);
                  }
                }}
                onMouseLeave={() => {
                  const indicator = document.getElementById(
                    "color-picker-preview-dont-use-this-id-for-anything-else-hopefully-or-doom-will-come-for-your-loved-ones",
                  );
                  if (indicator) {
                    indicator.remove();
                  }
                }}
                onMouseMove={(e) => {
                  const ctx = canvas.current?.getContext("2d");

                  if (!ctx || !canvas.current) return;

                  const rect = canvas.current.getBoundingClientRect();

                  const scaleX = canvas.current.width / rect.width;
                  const scaleY = canvas.current.height / rect.height;

                  const x = Math.floor((e.clientX - rect.left) * scaleX);
                  const y = Math.floor((e.clientY - rect.top) * scaleY);

                  const rgb = ctx.getImageData(x, y, 1, 1).data;
                  const hex =
                    "#" +
                    Array.from(rgb)
                      .map((item) => item.toString(16).padStart(2, "0"))
                      .join("");

                  const indicator = document.getElementById(
                    "color-picker-preview-dont-use-this-id-for-anything-else-hopefully-or-doom-will-come-for-your-loved-ones",
                  );
                  if (indicator) {
                    indicator.style.backgroundColor = hex;
                    indicator.style.left = `${e.clientX + 20}px`;
                    indicator.style.top = `${e.clientY - 20}px`;
                  }
                }}
                onClick={(e) => {
                  const ctx = canvas.current?.getContext("2d");

                  if (!ctx || !canvas.current) return;

                  const rect = canvas.current.getBoundingClientRect();

                  const scaleX = canvas.current.width / rect.width;
                  const scaleY = canvas.current.height / rect.height;

                  const x = Math.floor((e.clientX - rect.left) * scaleX);
                  const y = Math.floor((e.clientY - rect.top) * scaleY);

                  const rgb = ctx.getImageData(x, y, 1, 1).data;
                  const hexArr = Array.from(rgb);

                  if (!!!alpha) {
                    hexArr.pop();
                  }

                  const hex =
                    "#" +
                    hexArr
                      .map((item) => item.toString(16).padStart(2, "0"))
                      .join("");

                  setColor(hex);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-2 flex-wrap">
        {editablePresets
          ? presets.map((color, index) => (
              <ContextMenu key={index}>
                <ContextMenuTrigger
                  className="size-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                  onClick={() => setColor(color)}
                />
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      setPresets(presets.filter((t, i) => i !== index));
                      onPresetChange(preset);
                    }}
                  >
                    Remove color
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          : presets.map((color, index) => (
              <button
                key={index}
                className="size-6 rounded-full border-2 border-white"
                style={{ backgroundColor: color }}
                onClick={() => setColor(color)}
              />
            ))}
        {editablePresets && (
          <Button
            size={"icon-xs"}
            variant={"outline"}
            onClick={() => {
              setPresets([...presets, color]);
              onPresetChange(preset);
            }}
          >
            +
          </Button>
        )}
      </div>
      <Button onClick={() => onPick(color)}>Pick Color.</Button>
    </div>
  );
}

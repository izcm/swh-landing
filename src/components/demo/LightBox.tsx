import { Modal } from "@a2zb/react";
import { RoundIconBtn } from "./RoundIconBtn";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

type LightboxItem =
  | { type: "image"; src: string; title?: string; alt: string }
  | { type: "video"; src: string; title?: string };

type Props = {
  items: LightboxItem[];
  index: number;
  isOpen: boolean;
  onClose: () => void;
};

export function LightBox({ items, index, isOpen, onClose }: Props) {
  const current = items[index];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCancelBtn
      className="max-w-full size-full"
      overlayClassName="bg-black/40 backdrop-blur-sm"
    >
      <div className="relative h-full">
        <div
          className="
            absolute flex items-center justify-between
             w-full mt-4 px-6 top-0
            "
        >
          <span className="text-lg">
            {index} / {items.length}
          </span>

          <RoundIconBtn
            onClick={onClose}
            className="size-12 border-transparent"
            label="Close"
          >
            <X />
          </RoundIconBtn>
        </div>

        <div className="flex items-center justify-center gap-6 p-12 rounded h-full">
          <RoundIconBtn
            onClick={() => {}}
            label="Previous"
            className="size-12 border-transparent"
          >
            <ArrowLeft className="size-8" strokeWidth={1.2} />
          </RoundIconBtn>

          {current.type === "image" ? (
            <img
              src={current.src}
              alt={current.alt}
              className="rounded-lg min-w-0 object-contain"
            />
          ) : (
            <video src={current.src} controls className="rounded-lg min-w-0" />
          )}

          <RoundIconBtn
            onClick={() => {}}
            label="Next"
            className="size-12 border-transparent"
          >
            <ArrowRight className="size-8" strokeWidth={1.2} />
          </RoundIconBtn>
        </div>
      </div>
    </Modal>
  );
}

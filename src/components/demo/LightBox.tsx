import { Modal } from "@a2zb/react";
import { RoundIconBtn } from "./RoundIconBtn";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useSlides } from "../../lib/useSlides";

type LightboxItem =
  | { type: "image"; src: string; title?: string; alt: string }
  | { type: "video"; src: string; title?: string };

type Props = {
  items: LightboxItem[];

  defaultIndex?: number; // where to start when uncontrolled
  isOpen: boolean;
  onClose: () => void;

  // pass if parent controls the index
  index?: number;
  onChange?: (i: number) => void;
};

export function LightBox({
  items,
  index: indexProp,
  defaultIndex,
  onChange,
  isOpen,
  onClose,
}: Props) {
  const { index, prev, next } = useSlides({
    count: items.length,
    index: indexProp,
    defaultIndex,
    onChange,
  });
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
            {index + 1} / {items.length}
          </span>

          <RoundIconBtn
            onClick={onClose}
            className="size-12 border-transparent"
            label="Close"
          >
            <X />
          </RoundIconBtn>
        </div>

        <div
          className="
            flex flex-wrap items-center justify-center 
            gap-6 rounded h-full content-center
            xl:flex-nowrap
            "
        >
          <RoundIconBtn
            onClick={prev}
            label="Previous"
            className="size-12 border-transparent"
          >
            <ArrowLeft className="size-8" strokeWidth={1.2} />
          </RoundIconBtn>

          {current.type === "image" ? (
            <img
              src={current.src}
              alt={current.alt}
              className="
                rounded-lg  min-w-0 object-contain max-w-7xl
                max-xl:order-first max-xl:basis-full

                "
            />
          ) : (
            <video
              src={current.src}
              controls
              className="rounded-lg min-w-0 max-xl:order-first"
            />
          )}

          <RoundIconBtn
            onClick={next}
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

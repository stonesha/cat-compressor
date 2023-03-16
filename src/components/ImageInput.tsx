import { open } from "@tauri-apps/api/dialog";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api";

import useStore, { type CompressionResult } from "@/lib/useStore";

function ImageInput() {
  const selectedImages = useStore((state) => state.selectedImages);
  const setSelectedImages = useStore((state) => state.setSelectedImages);
  const setCompressionResult = useStore((state) => state.setCompressionResult);

  async function handleOpen() {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: "Image",
          extensions: ["jpeg", "jpg"],
        },
      ],
    });
    if (selected) setSelectedImages(selected);
  }

  function renderImageGrid() {
    // if multiple images were selected
    if (Array.isArray(selectedImages)) {
      return selectedImages.map((image, index) => (
        <div key={index}>{image}</div>
      ));

      // if only one image was selected
    } else if (typeof selectedImages === "string") {
      return <div>{selectedImages}</div>;
    }
  }

  async function compressImages() {
    const results: CompressionResult[] = await invoke("compress_images", {
      filepaths: selectedImages,
    });

    setCompressionResult(results);
  }

  return (
    <div className="h-full w-full">
      {selectedImages ? (
        <div className="flex flex-col justify-between h-full w-full p-10">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Selected Image(s)
            </h3>
            <hr />
          </div>

          {renderImageGrid()}

          <div className="flex justify-end gap-x-3">
            <button
              type="button"
              className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => setSelectedImages(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => compressImages()}
            >
              Compress
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleOpen}
        >
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-semibold text-gray-900">
            Compress Image(s)
          </span>
        </button>
      )}
    </div>
  );
}

export default ImageInput;

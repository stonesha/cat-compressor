import ImageInput from "@/components/ImageInput";
import useStore from "@/lib/useStore";

function App() {
  const compressionResult = useStore((state) => state.compressionResult);
  const setCompressionResult = useStore((state) => state.setCompressionResult);
  const setSelectedImages = useStore((state) => state.setSelectedImages);

  function renderCompressionResults() {
    if (!compressionResult) return <div></div>;

    return compressionResult.map((result) => {
      if (result.error !== "") {
        return (
          <div key={result.original_file}>
            Image "{result.original_file}" could not be compressed.
            <br />
            Error: "{result.error}"
            <hr />
            <br />
          </div>
        );
      } else {
        return (
          <div key={result.original_file}>
            Image "{result.original_file}" successfully compressed.
            <hr />
            <br />
          </div>
        );
      }
    });
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl sm:tracking-tight">
        cat-compressor
      </h1>
      <div className="mt-2 text-sm text-gray-500 text-center">
        *only supports jpeg(for now)
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center p-5">
        {compressionResult !== null ? (
          <div>
            {renderCompressionResults()}
            <div className="w-full flex flex-row justify-center">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  setCompressionResult(null);
                  setSelectedImages(null);
                }}
              >
                Compress More
              </button>
            </div>
          </div>
        ) : (
          <ImageInput />
        )}
      </div>
    </div>
  );
}

export default App;

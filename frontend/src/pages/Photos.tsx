import { useParams } from "react-router-dom";

// Auto-import all photos from each folder
const photosData: Record<string, string[]> = {
  "2024": Object.values(
    import.meta.glob("/src/assets/photos/2024/*.{png,jpg,jpeg}", {
      eager: true,
      import: "default",
    })
  ),
  "2023": Object.values(
    import.meta.glob("/src/assets/photos/2023/*.{png,jpg,jpeg}", {
      eager: true,
      import: "default",
    })
  ),
  "legends": Object.values(
    import.meta.glob("/src/assets/photos/legends/*.{png,jpg,jpeg}", {
      eager: true,
      import: "default",
    })
  ),
};

function Photos() {
  const { yearOrType } = useParams<{ yearOrType: string }>();
  const photos = photosData[yearOrType || ""] || [];

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">
        📸 RCB Photos {yearOrType?.toUpperCase()}
      </h1>
  
      {photos.length === 0 ? (
        <p className="text-gray-400 text-center">No photos available yet.</p>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {photos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`RCB ${yearOrType} ${idx}`}
              className="w-full rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
  
  
}

export default Photos;

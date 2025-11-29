import React from "react";

// Lấy Base URL của Backend từ biến môi trường
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function MediaViewer({ media = [] }) {
  if (!media || media.length === 0) {
    return <p className="text-sm text-gray-500">Không có media đính kèm.</p>;
  }

  return (
    <div className="space-y-4">
      {media.map((item) => {
        // Tạo đường dẫn tuyệt đối đến file media
        const fullUrl = `${BACKEND_URL}${item.URL}`;

        switch (item.MEDIA_TYPE) {
          case "IMAGE":
            return (
              <div key={item.MEDIA_ID}>
                <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={fullUrl}
                    alt={`Incident media ${item.MEDIA_ID}`}
                    className="max-w-full rounded-md border"
                  />
                </a>
              </div>
            );

          case "VIDEO":
            return (
              <div key={item.MEDIA_ID}>
                <video
                  src={fullUrl}
                  controls // Thêm nút điều khiển (play/pause, volume)
                  className="max-w-full rounded-md border bg-black"
                >
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
              </div>
            );

          case "AUDIO":
            return (
              <div key={item.MEDIA_ID}>
                <audio
                  src={fullUrl}
                  controls // Thêm nút điều khiển
                  className="w-full"
                >
                  Trình duyệt của bạn không hỗ trợ thẻ audio.
                </audio>
              </div>
            );

          default:
            return (
              <div key={item.MEDIA_ID} className="text-sm">
                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Tải xuống tài liệu (DOCUMENT)
                </a>
              </div>
            );
        }
      })}
    </div>
  );
}

import React, { Suspense } from "react";

const page = () => {
  return (
    <section>
      <Suspense fallback={<p>Loading video...</p>}>
        <video width="320" height="240" controls preload="none">
          <source
            src="https://videotranscodervinayak.blob.core.windows.net/transcoded-videos/Untitled design_74850b94-a744-4c38-ade1-de68e9a132eb-720p.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </Suspense>
      {/* Other content of the page */}
    </section>
  );
};

export default page;

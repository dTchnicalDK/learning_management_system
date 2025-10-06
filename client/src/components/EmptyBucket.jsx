import React from "react";
import emptyBucketImage from "@/assets/emptyBucket.svg";

const EmptyBucket = ({ message = "No Data Found!" }) => {
  return (
    <div>
      <h1 className="relative top-[50vh] transform translate-x-[-50%] translate-y-[-50%] left-[50%] text-6xl text-stone-500">
        {message}
      </h1>
      <img src={emptyBucketImage} alt="emptyImage" />
    </div>
  );
};

export default EmptyBucket;

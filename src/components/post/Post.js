export const Post = (props) => {
  return (
    <div className="m-6">
      <div>
        <div className="flex justify-between">
          <div className="self-start">
            <p>{props.post.postedBy ? props.post.postedBy : 'Unknown User'}</p>
            <p>{props.post.dateCreated}</p>
          </div>
          <div className="self-end">
            <p className="ml-10">{props.post.likes.length}</p>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div>
            <h2 className="text-xl">{props.post.title}</h2>
            <p>{props.post.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Genres = (props) => {
  return (
    <div class="genres flex">
      <For each={props.genres}>
        {(genre) => {
          return <div className="genre">{genre.name}</div>;
        }}
      </For>
    </div>
  );
};

export default Genres;

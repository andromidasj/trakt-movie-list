import { Button, Group, Title } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Bookmark,
  BookmarkFill,
  CheckCircle,
  CheckCircleFill,
} from 'react-bootstrap-icons';
import { useParams, useSearchParams } from 'react-router-dom';
import { QUERY_KEYS } from '../../enums/QueryKeys';
import { SEARCH_PARAMS } from '../../enums/SearchParams';
import { API } from '../../util/api';
import './ListActions.scss';

const activeButtonRoot = {
  height: 60,
  '&:active': {
    scale: 0.5,
    opacity: 0.5,
  },
};

const disabledButtonRoot = { ...activeButtonRoot, backgroundColor: 'black' };

function ListActions() {
  const queryClient = useQueryClient();
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const listId = searchParams.get(SEARCH_PARAMS.LIST);
  const watchedId = searchParams.get(SEARCH_PARAMS.WATCHED);
  const name = searchParams.get(SEARCH_PARAMS.NAME);

  // TODO: If no movieId, redirect

  const getList = useQuery([QUERY_KEYS.LIST, listId], () =>
    API.getListItems(+listId!)
  );

  const getWatched = useQuery([QUERY_KEYS.LIST, watchedId], () =>
    API.getListItems(+watchedId!)
  );

  const mutationSideEffects = {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.LIST]);
      queryClient.invalidateQueries([QUERY_KEYS.LIST_ITEMS]);
    },
    retry: 2,
    retryDelay: 1000,
  };

  const addMovie = useMutation(API.addMovieToList, mutationSideEffects);
  const removeMovie = useMutation(API.removeMovieFromList, mutationSideEffects);

  if (getList.isLoading || getWatched.isLoading) {
    return (
      <div className="md-list-actions-container">
        <div className="md-list-action">
          <Bookmark style={{ opacity: 0 }} />
          <span style={{ opacity: 0 }}>Add to List</span>
        </div>
        <div className="md-list-action">
          <CheckCircle style={{ opacity: 0 }} />
          <span style={{ opacity: 0 }}>Unwatched</span>
        </div>
      </div>
    );
  }

  if (getList.isError || getWatched.isError) {
    return <h1>{`Error ${getList.error || getWatched.error}`}</h1>;
  }

  const inList = getList.data!.data.find(
    (movie) => movie.movie.ids.tmdb === Number(movieId)
  );

  const inWatched = getWatched.data!.data.find(
    (movie) => movie.movie.ids.tmdb === Number(movieId)
  );

  const markAsWatched = () => {
    addMovie.mutate({ movieId: +movieId!, listId: +watchedId! });
    !!inList && removeMovie.mutate({ movieId: +movieId!, listId: +listId! });
    // make confetti
  };

  return (
    <>
      <Title order={5} align="center" transform="uppercase" mt={10}>
        {name}
      </Title>
      <Group grow position="apart" my={15}>
        {inList ? (
          <Button
            size="lg"
            radius="md"
            leftIcon={<BookmarkFill />}
            onClick={() =>
              removeMovie.mutate({ movieId: +movieId!, listId: +listId! })
            }
            sx={activeButtonRoot}
          >
            Watchlist
          </Button>
        ) : (
          // <div
          //   className="md-list-action"
          //   onClick={() =>
          //     removeMovie.mutate({ movieId: +movieId!, listId: +listId! })
          //   }
          // >
          //   <BookmarkFill className="action-icon" />
          //   <span>Added to List</span>
          // </div>
          // <div
          //   className="md-list-action"
          //   onClick={() =>
          //     addMovie.mutate({ movieId: +movieId!, listId: +listId! })
          //   }
          // >
          //   <Bookmark className="action-icon" />
          //   <span>Add to List</span>
          // </div>
          <Button
            size="lg"
            radius="md"
            leftIcon={<Bookmark />}
            onClick={() =>
              addMovie.mutate({ movieId: +movieId!, listId: +listId! })
            }
            styles={(theme) => ({
              leftIcon: { color: theme.colors.blue[4] },
              root: disabledButtonRoot,
            })}
          >
            Add to List
          </Button>
        )}
        {inWatched ? (
          <div
            className="md-list-action"
            onClick={() =>
              removeMovie.mutate({ movieId: +movieId!, listId: +watchedId! })
            }
          >
            <CheckCircleFill className="action-icon" />
            <span>Watched</span>
          </div>
        ) : (
          <div className="md-list-action" onClick={markAsWatched}>
            <CheckCircle className="action-icon" />
            <span>Unwatched</span>
          </div>
        )}
      </Group>
    </>
  );
}

export default ListActions;

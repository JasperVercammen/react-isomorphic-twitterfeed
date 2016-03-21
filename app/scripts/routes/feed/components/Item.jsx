/**
 * Created by mobinni on 08/12/15.
 */
import React, {Component} from 'react';
import Post from '../../../components/Post';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import http from 'http';

import '../../../../styles/components/feed.scss';

class Item extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.setState({
      statuses: []
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log('UPDATE: ', nextProps);
    http.get({
      hostname: 'localhost',
      port: 9000,
      path: '/api/twitter-feed?limit=15&search=#react'
    }, (res) => {
      // Do stuff with response
      //console.log(res);
      this.setState({
        statuses: res.statuses
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {

    console.log('IN SHOULD', nextProps);
    return nextProps.id !== this.props.id;
  }

  componentDidMount() {
    //this.serverRequest = $.get(this.props.source, function (result) {
    //  var lastGist = result[0];
    //  this.setState({
    //    username: lastGist.owner.login,
    //    lastGistUrl: lastGist.html_url
    //  });
    //}.bind(this));




  }

  render() {
    const {params} = this.props;
    let posts = this.state.statuses || [];
    //for (var i=0; i < 15; i++) {
    //  post.push(<Post {this.state.statuses[i]} />);
    //}
    return (
      <div>
        Twitter feed: {params.item}
        {posts.map(function(status, j) {
            return <Post {...status} />;
          })
        }

      </div>
    )
  }
}

export default Item;


// 'use strict';

/*

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return Object.assign({}, state, {
        completed: !state.completed,
      });
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action),
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

// Combine the reducers into one (to use in the store)
const todoApp = combineReducers({
  todos,
  visibilityFilter,
});

// ACTIONCREATORS

// Variable to hold the index of todos
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text: text,
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter,
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id,
  };
};

// Presentational component (todo list item, no functionality in here)
const Todo = ({
    onClick,
    completed,
    text
    }) => (
    <li onClick={onClick}
        style={{
            textDecoration: completed ? 'line-through' : 'none',
        }}
    >
      {text}
    </li>
);

// Presentational component (todo list wrapper, no functionality in here)
const TodoList = ({
    todos,
    onTodoClick,
    }) => (
    <ul>
      {todos.map(todo =>
      <Todo
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
      />
          )}
    </ul>
);

let AddTodo = ({ dispatch }) => {
  let input;

  return (
      <div>
        <input ref={node => {
                input = node;
            }}
        />
        <button onClick={() => {
                dispatch(addTodo(input.value));
                input.value = '';
            }}
        >
          Add todo
        </button>
      </div>
  );
};
AddTodo = connect()(AddTodo);

// Filterlink component
const Link = ({
    active,
    children,
    onClick,
    }) => {
  if (active) {
    return <span> {children} </span>
  }
  return (
      <a href='#' onClick={e => {
            e.preventDefault();
            onClick();
        }}
      >
        {children}
      </a>
  );
};

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter,
  };
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter)),
  };
};
const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

const Footer = () => (
    <p>
      Show:
      {' '}
      <FilterLink filter='SHOW_ALL'>
        All
      </FilterLink>
      {' '}
      <FilterLink filter='SHOW_ACTIVE'>
        Active
      </FilterLink>
      {' '}
      <FilterLink filter='SHOW_COMPLETED'>
        Completed
      </FilterLink>
    </p>
);

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
        state.todos,
        state.visibilityFilter
    ),
  };
};

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: id =>
        dispatch(toggleTodo(id)),
  };
};

const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);

// Function to filer the chosen todos
const getVisibleTodos = (
    todos,
    filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
          t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
          t => !t.completed
      );
  }
};

// Wrapper component with the todolist, add field en filter links
const TodoApp = () => (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
);

// Render function
ReactDOM.render(
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>,
    document.getElementById('root')
);


    */
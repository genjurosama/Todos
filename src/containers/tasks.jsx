import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchTasks, addTask, deleteTask } from "../actions/tasks";
import { setDescription, setTitle, showModal } from "../actions/ui";
import { TasksList } from "../components/tasksList.jsx";
import { Input, Button } from "travix-ui-kit";
import "travix-ui-kit/_site/ui-bundle.css";
import "travix-ui-kit/_site/theme.css";
import "../App.scss";
class Tasks extends Component {
  constructor(props) {
    super(props);
    this.handleClick.bind(this);
  }
  componentDidMount() {
    this.props.fetchTasks();
  }
  handleClick() {
    this.props.addTask({
      title: this.props.title,
      description: this.props.description
    });
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-3">
            <Input maxlength={20}
              placeholder="Add Title.."
              value={this.props.title}
              onChange={(e, value) => {
                this.props.setTitle(e.target.value);
              }}
            />
          </div>
          <div className="col-md-3">
            <Input
              multiline
              placeholder="Add Description.."
              value={this.props.description}
              onChange={(e, value) => {
                this.props.setDescription(e.target.value);
              }}
            />
          </div>
          <div className="col-md-6">
            <Button
              type="button"
              size="m"
              onClick={() => this.handleClick()}
              disabled={this.props.disableButton}
            >
              Add
            </Button>
            <br />
            <br />
          </div>
        </div>

        <h3> Tasks List: </h3>
        <TasksList
          tasks={this.props.tasks}
          showEditPage={this.props.showModal}
          deleteTask={this.props.deleteTask}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.tasksReducer.tasks || [],
    title: state.uiReducer.title,
    description: state.uiReducer.description,
    disableButton: !!!state.uiReducer.title
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchTasks, addTask, setDescription, setTitle, showModal, deleteTask },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Tasks);

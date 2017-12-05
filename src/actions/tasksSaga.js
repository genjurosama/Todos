import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getTasks } from "../api/tasks";
import axios from "axios";
import {
  TASKS_FETCH_SUCCEEDED,
  TASKS_FETCH_REQUESTED,
  TASKS_FETCH_FAILED,
  TASK_ADD,
  TASK_ADD_FAILED,
  TASK_ADD_SUCCEEDED,
  TASK_EDIT,
  TASK_EDIT_SUCCEEDED,
  TASK_EDIT_FAILED,
  TASK_DELETE,
  TASK_DELETE_FAILED,
  TASK_DELETE_SUCCEEDED
} from "./tasks";
import { HIDE_MODAL } from "./ui";

export function fetchTskApi() {
  return axios.get("http://localhost:9001/tasks");
}

export function addTskApi(task) {
  return axios.post("http://localhost:9001/task/create", {
    title: task.title,
    description: task.description
  });
}

export function editTskApi(id, task) {
  return axios.put(
    `http://localhost:9001/task/update/${id}/${task.title}/${task.description}`
  );
}

export function deleteTskApi(id) {
  return axios.delete(`http://localhost:9001/task/delete/${id}`);
}

function* fetchTasks() {
  try {
    const response = yield call(fetchTskApi);
    yield put({ type: TASKS_FETCH_SUCCEEDED, tasks: response.data.tasks });
  } catch (e) {
    yield put({ type: TASKS_FETCH_FAILED, message: e.message });
  }
}

function* addTask(action) {
  try {
    const response = yield call(addTskApi, action.task);

    yield put({ type: TASK_ADD_SUCCEEDED });
    yield put({ type: TASKS_FETCH_REQUESTED });
  } catch (e) {
    yield put({ type: TASK_ADD_FAILED, message: e.message });
  }
}

function* editTask(action) {
  try {
    const response = yield call(editTskApi, action.id, action.task);
    yield put({ type: TASK_EDIT_SUCCEEDED });
    yield put({ type: TASKS_FETCH_REQUESTED });
    yield put({ type: HIDE_MODAL });
  } catch (e) {
    yield put({ type: TASK_EDIT_FAILED, message: e.message });
  }
}

function* deleteTask(action) {
  try {
    const response = yield call(deleteTskApi, action.id);
    yield put({ type: TASK_DELETE_SUCCEEDED });
    yield put({ type: TASKS_FETCH_REQUESTED });
  } catch (e) {
    yield put({ type: TASK_DELETE_FAILED, message: e.message });
  }
}

function* mySaga() {
  yield takeEvery(TASKS_FETCH_REQUESTED, fetchTasks);
  yield takeEvery(TASK_ADD, addTask);
  yield takeEvery(TASK_EDIT, editTask);
  yield takeEvery(TASK_DELETE, deleteTask);
}

export default mySaga;
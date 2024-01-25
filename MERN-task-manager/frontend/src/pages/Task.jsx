import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Task = () => {
  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? 'add' : 'update';
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === 'add' ? 'Add task' : 'Update Task';
  }, [mode]);

  useEffect(() => {
    if (mode === 'update') {
      const config = { url: `/tasks/${taskId}`, method: 'get', headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then(data => {
        setTask(data.task);
        setFormData({ title: data.task.title, time: data.task.time, description: data.task.description });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = e => {
    e.preventDefault();
    setFormData({
      title: task.title,
      time: task.time,
      description: task.description
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields('task', formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = {
      url: mode === 'add' ? '/tasks' : `/tasks/${taskId}`,
      method: mode === 'add' ? 'post' : 'put',
      data: formData,
      headers: { Authorization: authState.token }
    };

    fetchData(config).then(() => {
      navigate('/');
    });
  };

  const fieldError = field => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? 'block' : 'hidden'}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <MainLayout>
      <form className='m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-4'>{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
            <div className='mb-4'>
              <label htmlFor='title'>Title</label>
              <input type='text' name='title' id='title' value={formData.title}
              className="block w-full h-10 mt-2 px-3 py-2 text-gray-600 
              rounded-[4px] border-2 border-gray-100 focus:border-primary transition outline-none hover:border-gray-300"
              placeholder='Enter title...' onChange={handleChange} />
              {fieldError('title')}
            </div>
            
            <div className='mb-4'>
              <label htmlFor='description'>Description</label>
              <Textarea type='description' name='description' id='description' value={formData.description} placeholder='Write here..' onChange={handleChange} />
              {fieldError('description')}
            </div>
            <div className='mb-4'>
              <label htmlFor='time'>Time</label>
              <input type='time' name='time' id='time' value={formData.time} 
              className="block w-full h-10 mt-2 px-3 py-2 text-gray-600 
              rounded-[4px] border-2 border-gray-100 focus:border-primary transition outline-none hover:border-gray-300"
              placeholder='Enter time...' onChange={handleChange} />
              {fieldError('time')}
            </div>
            <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>{mode === 'add' ? 'Add task' : 'Update Task'}</button>
            <button className='ml-4 bg-red-500 text-white px-4 py-2 font-medium' onClick={() => navigate('/')}>Cancel</button>
            {mode === 'update' && <button className='ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600' onClick={handleReset}>Reset</button>}
          </>
        )}
      </form>
    </MainLayout>
  );
};

export default Task;

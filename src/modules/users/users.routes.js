import { Router } from 'express';
import * as controller from './users.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

export const endpoints = [
  {
    path: '/api/users/all',
    method: 'GET',
    description: 'Get all users (admin only)',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: [{ id: 1, username: 'user1', email: 'user@example.com', user_type: 'user' }]
  },
  {
    path: '/api/users/:id',
    method: 'GET',
    description: 'Get user by ID (admin only)',
    params: ['id'],
    attributes: [
      { name: 'id', in: 'path', type: 'number', required: true, description: 'User ID', example: 1 }
    ],
    sampleRequest: {},
    sampleResponse: { id: 1, username: 'user1', email: 'user@example.com', user_type: 'user' }
  },
  {
    path: '/api/users/:id',
    method: 'PUT',
    description: 'Update user (admin only)',
    params: ['id'],
    attributes: [
      { name: 'id', in: 'path', type: 'number', required: true, description: 'User ID', example: 1 },
      { name: 'firstname', in: 'body', type: 'string', required: false, description: 'First name', example: 'John' },
      { name: 'lastname', in: 'body', type: 'string', required: false, description: 'Last name', example: 'Doe' },
      { name: 'email', in: 'body', type: 'string', required: false, description: 'Email', example: 'john@example.com' },
      { name: 'phone', in: 'body', type: 'string', required: false, description: 'Phone', example: '0917...' }
    ],
    sampleRequest: { firstname: 'John', lastname: 'Doe', email: 'john@example.com' },
    sampleResponse: { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com' }
  },
  {
    path: '/api/users/:id',
    method: 'DELETE',
    description: 'Delete user (admin only)',
    params: ['id'],
    attributes: [
      { name: 'id', in: 'path', type: 'number', required: true, description: 'User ID', example: 1 }
    ],
    sampleRequest: {},
    sampleResponse: { message: 'User deleted successfully' }
  },
  {
    path: '/api/users/:id/verify',
    method: 'POST',
    description: 'Verify user email (admin only)',
    params: ['id'],
    attributes: [
      { name: 'id', in: 'path', type: 'number', required: true, description: 'User ID', example: 1 }
    ],
    sampleRequest: {},
    sampleResponse: { message: 'User verified successfully' }
  },
  {
    path: '/api/users/type/:type',
    method: 'GET',
    description: 'Get users by type (admin only)',
    params: ['type'],
    attributes: [
      { name: 'type', in: 'path', type: 'string', required: true, description: 'User type (user/admin)', example: 'user' }
    ],
    sampleRequest: {},
    sampleResponse: [{ id: 1, username: 'user1', email: 'user@example.com', user_type: 'user' }]
  },
  {
    path: '/api/users/search',
    method: 'GET',
    description: 'Search users by name or email (admin only)',
    queryParams: ['q'],
    attributes: [
      { name: 'q', in: 'query', type: 'string', required: true, description: 'Search query', example: 'john' }
    ],
    sampleRequest: {},
    sampleResponse: [{ id: 1, username: 'john_doe', email: 'john@example.com', user_type: 'user' }]
  }
];

// All user management routes require admin authentication
router.use(requireAuth, requireAdmin);

router.get('/all', controller.getAllUsers);
router.get('/:id', validate(z.object({ id: z.string().transform(Number) }), 'params'), controller.getUserById);
router.put('/:id', validate(z.object({ id: z.string().transform(Number) }), 'params'), controller.updateUser);
router.delete('/:id', validate(z.object({ id: z.string().transform(Number) }), 'params'), controller.deleteUser);
router.post('/:id/verify', validate(z.object({ id: z.string().transform(Number) }), 'params'), controller.verifyUser);
router.get('/type/:type', validate(z.object({ type: z.enum(['user', 'admin']) }), 'params'), controller.getUsersByType);
router.get('/search', validate(z.object({ q: z.string().min(1) }), 'query'), controller.searchUsers);

export default router;



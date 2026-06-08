/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputForm } from '../InputForm'

test('submits with filePath when in path mode', async () => {
  const onSubmit = jest.fn()
  render(<InputForm onSubmit={onSubmit} loading={false} />)
  await userEvent.type(screen.getByPlaceholderText(/\/path\/to/i), '/tmp/test.md')
  await userEvent.click(screen.getByRole('button', { name: /translate/i }))
  expect(onSubmit).toHaveBeenCalledWith({ filePath: '/tmp/test.md' })
})

test('switches to paste mode and submits text', async () => {
  const onSubmit = jest.fn()
  render(<InputForm onSubmit={onSubmit} loading={false} />)
  await userEvent.click(screen.getByRole('button', { name: /paste text/i }))
  await userEvent.type(screen.getByPlaceholderText(/paste your markdown/i), '# Hello')
  await userEvent.click(screen.getByRole('button', { name: /translate/i }))
  expect(onSubmit).toHaveBeenCalledWith({ text: '# Hello' })
})

test('disables Translate button when input is empty', () => {
  render(<InputForm onSubmit={() => {}} loading={false} />)
  expect(screen.getByRole('button', { name: /translate/i })).toBeDisabled()
})

test('disables Translate button when loading=true', async () => {
  render(<InputForm onSubmit={() => {}} loading={true} />)
  await userEvent.type(screen.getByPlaceholderText(/\/path\/to/i), '/tmp/test.md')
  expect(screen.getByRole('button', { name: /translating/i })).toBeDisabled()
})

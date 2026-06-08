/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeToolbar } from '../ModeToolbar'

test('renders Hybrid, EN, ZH buttons', () => {
  render(<ModeToolbar mode="hybrid" onChange={() => {}} />)
  expect(screen.getByText('Hybrid')).toBeInTheDocument()
  expect(screen.getByText('EN')).toBeInTheDocument()
  expect(screen.getByText('ZH')).toBeInTheDocument()
})

test('calls onChange with the selected mode', async () => {
  const onChange = jest.fn()
  render(<ModeToolbar mode="hybrid" onChange={onChange} />)
  await userEvent.click(screen.getByText('ZH'))
  expect(onChange).toHaveBeenCalledWith('zh')
})

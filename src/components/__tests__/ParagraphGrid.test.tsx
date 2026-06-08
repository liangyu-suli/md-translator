/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { ParagraphGrid } from '../ParagraphGrid'
import { ParagraphState } from '../ParagraphCard'

const done: ParagraphState[] = [
  { index: 0, en: 'First', zh: '第一', status: 'done' },
  { index: 1, en: 'Second', zh: '第二', status: 'done' },
]

test('renders a spinner when loading=true and no paragraphs yet', () => {
  const { container } = render(
    <ParagraphGrid paragraphs={[]} mode="hybrid" loading={true} onRetry={() => {}} />
  )
  expect(container.querySelector('.animate-spin')).toBeInTheDocument()
})

test('renders all paragraph cards', () => {
  render(<ParagraphGrid paragraphs={done} mode="hybrid" loading={false} onRetry={() => {}} />)
  expect(screen.getByText('First')).toBeInTheDocument()
  expect(screen.getByText('Second')).toBeInTheDocument()
})

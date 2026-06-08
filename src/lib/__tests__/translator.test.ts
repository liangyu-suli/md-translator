import { translateParagraph } from '../translator'

jest.mock('openai', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    choices: [{ message: { content: '翻译后的文本' } }],
  })
  const MockOpenAI = jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  }))
  return { __esModule: true, default: MockOpenAI }
})

test('returns the translated Chinese text', async () => {
  const result = await translateParagraph('Hello world', 'fake-api-key')
  expect(result).toBe('翻译后的文本')
})

test('uses deepseek-v4-flash model', async () => {
  const OpenAI = require('openai').default
  await translateParagraph('Test text', 'fake-api-key')
  const mockInstance = OpenAI.mock.results[OpenAI.mock.results.length - 1].value
  expect(mockInstance.chat.completions.create).toHaveBeenCalledWith(
    expect.objectContaining({ model: 'deepseek-v4-flash' })
  )
})

test('throws when the API call fails', async () => {
  const OpenAI = require('openai').default
  OpenAI.mockImplementationOnce(() => ({
    chat: {
      completions: {
        create: jest.fn().mockRejectedValue(new Error('API quota exceeded')),
      },
    },
  }))
  await expect(translateParagraph('Hello', 'fake-key')).rejects.toThrow('API quota exceeded')
})

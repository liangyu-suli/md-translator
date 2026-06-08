import { translateParagraph } from '../gemini'

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => '翻译后的文本' },
      }),
    }),
  })),
}))

test('returns the translated Chinese text', async () => {
  const result = await translateParagraph('Hello world', 'fake-api-key')
  expect(result).toBe('翻译后的文本')
})

test('passes the model name gemini-3.1-flash-lite', async () => {
  const { GoogleGenerativeAI } = require('@google/generative-ai')
  const mockInstance = GoogleGenerativeAI.mock.results[0].value
  expect(mockInstance.getGenerativeModel).toHaveBeenCalledWith({
    model: 'gemini-3.1-flash-lite',
  })
})

test('throws when the API call fails', async () => {
  const { GoogleGenerativeAI } = require('@google/generative-ai')
  GoogleGenerativeAI.mockImplementationOnce(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockRejectedValue(new Error('API quota exceeded')),
    }),
  }))
  await expect(translateParagraph('Hello', 'fake-key')).rejects.toThrow('API quota exceeded')
})

import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")  # Returns the encoder object

text = 'Hello, Harman singh this side'
tokens = enc.encode(text)

print(text)
print(tokens)          # Token IDs
print(len(tokens))     # Token count
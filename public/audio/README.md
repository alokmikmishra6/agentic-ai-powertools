# Field Notes narration

These recordings are generated speech, not recordings of Alok Mishra's voice.

Generator: [Kokoro.js](https://github.com/hexgrad/kokoro/tree/main/kokoro.js), using
[Kokoro-82M v1.0 ONNX weights](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX).
The upstream Kokoro model and library use Apache-2.0 licensing. See the accompanying
KOKORO-LICENSE.txt and the [original model card](https://huggingface.co/hexgrad/Kokoro-82M).

The model is not distributed with this website. Generation happens locally; the
website serves only compressed AAC audio in M4A containers. No paid speech API is used.

Heart (`af_heart`, American English) is the default narrator for the Writing archive.
Voice names identify the model's stock voice presets. Code blocks, tables, and visual
diagrams are omitted from narration. Run `npm run audio:generate -- --all` to generate
missing or changed essays; completed recordings are reused.

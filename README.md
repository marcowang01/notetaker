# 📌 Overview

This project is an AI-assisted notetaking tool that utilizes speech recognition, natural language processing (NLP), and language model generation (LLM). It relies on essential dependencies such as FontAwesome, Axios, Next.js, React, OpenAI, and TypeScript.

## ⚙️ Setting Up

#### OPENAI_API_KEY
- Sign up for an OpenAI account.
- Navigate to the API settings page.
- Generate an API key.
- Copy the API key value.
- Set the value of OPENAI_API_KEY to the generated API key.

#### GOOGLE_CLIENT_ID
- Create a project in the Google Cloud Console.
- Enable the Google+ API for the project.
- Go to the Credentials page.
- Create an OAuth 2.0 client ID.
- Copy the client ID value and set it as GOOGLE_CLIENT_ID.

#### GOOGLE_CLIENT_SECRET
- Follow the steps to generate GOOGLE_CLIENT_ID.
- On the Credentials page, create an OAuth 2.0 client ID.
- Copy the client secret value and set it as GOOGLE_CLIENT_SECRET.

#### NEXTAUTH_SECRET
- Generate a long, random string to be used as the secret.
- Set the value of NEXTAUTH_SECRET to the generated secret.

#### GOOGLE_EMAIL
- Provide the email address associated with your Google account.
- Set the value of GOOGLE_EMAIL to the provided email address.

## 🚀 Run Locally
1.Clone the notetaker repository:
```sh
git clone https://github.com/marcowang01/notetaker
```
2.Install the dependencies with one of the package managers listed below:
```bash
pnpm install
bun install
npm install
yarn install
```
3.Start the development mode:
```bash
pnpm dev
bun dev
npm run dev
yarn dev
```

## ☁️ Deploy

`[Scribe](https://notetaker-git-master-marcowang01.vercel.app/)`

## 📄 License

MIT License

Copyright (c) 2023 Marco Wang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


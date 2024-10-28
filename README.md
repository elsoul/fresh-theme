# Theme Module for Fresh v2 App

This module provides tools to manage theme preferences (dark or light mode) in a
Fresh v2 app. It includes:

1. A default script for setting dark mode as the default theme.
2. A default script for setting light mode as the default theme.
3. A function to toggle between light and dark themes and persist the choice
   using `localStorage`.

## Features

- **Default Theme Initialization**: Choose between dark or light as the default
  theme based on user or system preferences.
- **Persistent Theme Setting**: Saves the selected theme in `localStorage` for
  consistent experience across sessions.
- **Simple API**: Minimal API with `setTheme` for theme management and initial
  setup scripts.

## Installation and Usage

### 1. Import the Module

Import the desired script (dark or light mode) in your app’s main entry point to
set the initial theme.

```typescript
import {
  defaultDarkModeScript,
  defaultLightModeScript,
  setTheme,
} from 'jsr:@elsoul/fresh-theme'
```

### 2. Adding the Theme Script to Your App

Insert the desired theme script in the `<head>` section of your app to
automatically apply the initial theme based on user settings or system
preferences.

#### Example for Default Dark Mode

```typescript
import { asset } from 'fresh/runtime'
import { define } from '@/utils/state.ts'
import { defaultDarkModeScript } from 'jsr:@elsoul/fresh-theme'

export default define.page(function App({ Component, state, url }) {
  return (
    <html lang={state.locale || 'en'}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: defaultDarkModeScript }} />
        <link rel='stylesheet' href={asset('/styles.css')} />
      </head>
      <body>
        <Component />
      </body>
    </html>
  )
})
```

#### Example for Default Light Mode

```typescript
import { asset } from 'fresh/runtime'
import { define } from '@/utils/state.ts'
import { defaultLightModeScript } from 'jsr:@elsoul/fresh-theme'

export default define.page(function App({ Component, state, url }) {
  return (
    <html lang={state.locale || 'en'}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: defaultLightModeScript }} />
        <link rel='stylesheet' href={asset('/styles.css')} />
      </head>
      <body>
        <Component />
      </body>
    </html>
  )
})
```

### 3. Changing the Theme Programmatically

Use the `setTheme` function to programmatically change the theme between light
and dark modes. This function updates the theme preference in `localStorage` and
adjusts the `<html>` element class.

```typescript
// Example: Setting the theme to dark mode
setTheme('dark')
// Example: Setting the theme to light mode
setTheme('light')
```

## API Reference

### `defaultDarkModeScript`

JavaScript code to initialize the theme with dark mode as the default. This
script applies the theme based on `localStorage` or system preference if no
theme is set.

### `defaultLightModeScript`

JavaScript code to initialize the theme with light mode as the default. This
script applies the theme based on `localStorage` or system preference if no
theme is set.

### `setTheme(newTheme: 'dark' | 'light')`

Sets the theme to `'dark'` or `'light'` and stores the choice in `localStorage`.
Adjusts the `<html>` element to reflect the new theme.

- **Parameters**:
  - `newTheme` - The desired theme, either `'dark'` or `'light'`.

### useTheme hook

```typescript
import { useTheme } from 'jsr:@elsoul/fresh-theme'

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  )
}
```

## Contributing

Bug reports and pull requests are welcome on GitHub at
https://github.com/elsoul/fresh-theme This project is intended to be a safe,
welcoming space for collaboration, and contributors are expected to adhere to
the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the
[Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## Code of Conduct

Everyone interacting in the SKEET project’s codebases, issue trackers, chat
rooms and mailing lists is expected to follow the
[code of conduct](https://github.com/elsoul/skeet/blob/master/CODE_OF_CONDUCT.md).

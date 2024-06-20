# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.2.0] - 2024-06-20

### Added

-   Update check

## [4.1.7] - 2024-06-19

### Fixed

-   Discord internal breaking update

## [4.1.6] - 2024-06-17

### Changed

-   Code refactor

### Fixed

-   The expression picker was not opening in new voice channel text chat

## [4.1.5] - 2024-05-20

### Added

-   TypeScript

## [4.1.4] - 2024-03-28

### Fixed

-   ChannelTextAreaButtons filter

## [4.1.3] - 2024-01-03

### Changed

-   ExpressionPicker React element is now fetched from a parent component, not by its HTML Node

## [4.1.2] - 2024-01-03

### Changed

-   ChannelTextAreaButtons is now exported by Discord

## [4.1.1] - 2023-11-04

### Fixed

-   Patch catch block

## [4.1.0] - 2023-10-31

### Changed

-   ExpressionPickerStore renamed to ExpressionPicker (it was not a store)
-   ExpressionPicker module is now accessible directly with BD API.

### Fixed

-   Permissions module filters

## [4.0.1] - 2023-10-21

### Fixed

-   Expression picker navbar label order

## [4.0.0] - 2023-07-28

### Changed

-   The plugin UI is no longer an iframe overlay it is now a Discord Expression Picker
-   Refactored most of the plugin code

### Removed

-   RisiBank official wrapper

## [3.1.1] - 2023-07-25

### Fixed

-   getCurrentChannel return statement

## [3.1.0] - 2023-07-24

### Added

-   Use of a build system
-   This CHANGELOG file

### Changed

-   The plugin icon is no longer displayed if the TextArea input is disabled or if the user lacks the EMBED_LINKS permission

## [3.0.0] - 2023-07-22

### Fixed

-   Delete the click event listener on stop to prevent duplication

## [2.1.0] - 2023-07-19

### Added

-   Added the possibility to reply to a message with a sticker

### Changed

-   Use of the latest BetterDiscord Webpack API

### Fixed

-   Fixed ComponentDispatch being undefined

## [2.0.2] - 2023-07-04

### Fixed

-   The plugin icon is now only added to channel TextAreaButtons, not in profile

## [2.0.1] - 2023-06-19

### Added

-   Rerendering of the TextAreaButtons component after initial patching

## [2.0.0] - 2023-06-16

### Added

-   License file
-   BetterDiscord types

### Changed

-   The plugin now uses React patching instead of DOM patching

### Fixed

-   Prevent an error on startup by waiting for the TextAreaButtons selector

## [1.0.0] - 2023-06-06

### Added

-   Initial release

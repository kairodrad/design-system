You are an expert UI/UX developer specializing in creating comprehensive design systems for web applications, with particular expertise in game interfaces. 

Create a complete, production-ready design system for a web application game that includes:

## Core Requirements:
1. **Theming System**: Implement a robust theming architecture with:
   - 'light' theme (light/white backgrounds with dark/black text)
   - 'dark' theme (dark/black backgrounds with light/white text)  
   - 'system' theme (default - automatically detects and follows OS preference)
   - Theme should propagate to all child components automatically
   - Include smooth transitions when switching themes

2. **Component Library** - Create reusable components for:
   - Modals (with variations: confirmation, alert, form, fullscreen)
   - Buttons (primary, secondary, danger, ghost, icon-only, with loading states)
   - Menu systems (dropdown, context menu, navigation menu, hamburger)
   - Form elements (inputs, selects, checkboxes, radio buttons, sliders)
   - Cards and panels
   - Tooltips and popovers
   - Progress bars and loaders
   - Notifications/toasts
   - Game-specific: health bars, score displays, inventory grids, achievement popups

3. **File Structure** - Organize the system as follows:
```
/design-system/
/styles/
- variables.css (or scss/tokens)
- themes.css
- typography.css
- spacing.css
- animations.css
/components/
/buttons/
/modals/
/menus/
/forms/
/game-ui/
/utils/
- theme-provider.js/ts
- accessibility.js/ts
/docs/
- component-examples.html
```

4. **Technical Implementation**:
- Use CSS custom properties for dynamic theming
- Ensure all components are accessible (ARIA labels, keyboard navigation)
- Include hover, focus, and active states for all interactive elements
- Implement responsive design breakpoints
- Add subtle animations and transitions for game feel
- Consider performance (60fps animations, efficient repaints)

5. **Documentation**: For each component, provide:
- Usage examples
- Available props/options
- Accessibility considerations
- Theme customization points

## Deliverables:
Generate the complete file structure with actual implementation code. Start with the core theme system and variables, then implement at least 3-4 key components in detail to demonstrate the pattern. Include inline comments explaining design decisions and how other developers should extend the system.

Focus on making this immediately usable in a real project - all code should be production-ready, not placeholder. Use modern CSS/JavaScript practices but ensure broad browser compatibility.

Begin by asking me about:
1. The specific type/genre of game (if relevant for UI styling)
2. Preferred CSS methodology (vanilla CSS, CSS modules, styled-components, Tailwind, etc.)
3. JavaScript framework preference (vanilla JS, React, Vue, etc.)
4. Any specific brand colors or design constraints
5. Target platforms (desktop, mobile, or both)

If I don't provide specific answers, proceed with sensible defaults (vanilla CSS with CSS custom properties, vanilla JavaScript with optional framework adapters, responsive design for all platforms).
# Theme Configuration Guide

This application uses a centralized theming system that makes it easy to change the primary color throughout the entire app.

## How to Change the Theme Color

### Quick Change (Recommended)

1. Open `/src/constants/theme.ts`
2. Find the `PRIMARY_COLOR` constant at the top of the file
3. Replace the RGB values with your desired color

**Example: Change to Green**
```typescript
export const PRIMARY_COLOR = {
  r: 22,
  g: 163,
  b: 74
};
```

**Example: Change to Purple**
```typescript
export const PRIMARY_COLOR = {
  r: 147,
  g: 51,
  b: 234
};
```

That's it! The hover and light shades will be automatically calculated.

### Available Preset Colors

Choose from these ready-to-use color presets:

| Color   | RGB Values                     |
|---------|--------------------------------|
| Blue    | `{ r: 37, g: 99, b: 235 }`     |
| Green   | `{ r: 22, g: 163, b: 74 }`     |
| Purple  | `{ r: 147, g: 51, b: 234 }`    |
| Red     | `{ r: 220, g: 38, b: 38 }`     |
| Orange  | `{ r: 234, g: 88, b: 12 }`     |
| Teal    | `{ r: 20, g: 184, b: 166 }`    |
| Indigo  | `{ r: 99, g: 102, b: 241 }`    |

### Using Custom Colors

You can use any RGB color you want:

1. Find your desired color in any design tool or color picker
2. Get the RGB values (0-255 for each channel)
3. Update the `PRIMARY_COLOR` in `theme.ts`

## How It Works

The theme system uses:
- **CSS Custom Properties** (CSS variables) for color values
- **Tailwind CSS** theme extension for utility classes
- **Automatic color calculation** for hover and light variants

### Theme Classes Available

Use these Tailwind classes in your components:

- `bg-primary` - Primary background color
- `bg-primary-hover` - Darker/hover background color  
- `bg-primary-light` - Light/subtle background color
- `text-primary` - Primary text color
- `border-primary` - Primary border color
- `focus:ring-primary` - Primary focus ring

### Examples

```tsx
{/* Button */}
<button className="bg-primary hover:bg-primary-hover text-white">
  Click Me
</button>

{/* Card with light background */}
<div className="bg-primary-light border-primary">
  Content
</div>

{/* Text with primary color */}
<h1 className="text-primary font-bold">
  Heading
</h1>
```

## Technical Details

### Files Modified

- `/src/constants/theme.ts` - Theme color configuration
- `/src/main.tsx` - Theme initialization on app load
- `/tailwind.config.js` - Tailwind theme extension
- `/src/index.css` - CSS custom properties definition

### Color Calculation

The system automatically calculates:
- **Hover shade**: 75% of the primary color (darker)
- **Light shade**: 90% lighter than primary color

This ensures consistent visual hierarchy across the application.

## Troubleshooting

**Q: Colors aren't updating after changing theme.ts**  
A: Make sure to refresh your browser with a hard reload (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**Q: Can I have multiple themes that users can switch between?**  
A: Yes! You can extend the system to store different theme presets and allow runtime switching. The foundation is already in place.

**Q: The colors look too bright/dark**  
A: Adjust the RGB values in `theme.ts`. Lower values = darker, higher values = brighter. Try adjusting all three channels proportionally to maintain the same hue but change brightness.

# Modal Component Migration Guide

This guide helps you migrate from the existing Chakra UI modal components to the new unified Modal component.

## Overview

The new `Modal` component in `imports/ui/core/Modal.tsx` replaces both:

- `ConfirmModal` (from `imports/ui/generic/ConfirmModal.jsx`)
- `Modal` (from `imports/ui/generic/Modal.jsx`)

## Key Features

- ✅ No Chakra UI dependencies
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Unified API for both confirmation and regular modals
- ✅ Customizable styling via className props
- ✅ Keyboard navigation (Escape key)
- ✅ Body scroll prevention
- ✅ Responsive design

## Migration Examples

### 1. Replace ConfirmModal

**Before (ConfirmModal):**

```jsx
import ConfirmModal from 'imports/ui/generic/ConfirmModal';

<ConfirmModal
  visible={isOpen}
  title="Delete Item"
  onCancel={handleCancel}
  onConfirm={handleConfirm}
  confirmText="Delete"
  cancelText="Cancel"
>
  Are you sure you want to delete this item?
</ConfirmModal>;
```

**After (new Modal):**

```jsx
import Modal from 'imports/ui/core/Modal';

<Modal
  isOpen={isOpen}
  title="Delete Item"
  onClose={handleCancel}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  confirmText="Delete"
  cancelText="Cancel"
>
  Are you sure you want to delete this item?
</Modal>;
```

### 2. Replace Modal

**Before (Modal):**

```jsx
import Modal from 'imports/ui/generic/Modal';

<Modal
  isOpen={isOpen}
  title="Edit Item"
  onClose={handleClose}
  actionButtonLabel="Save"
  onActionButtonClick={handleSave}
  secondaryButtonLabel="Cancel"
  onSecondaryButtonClick={handleCancel}
>
  <form>...</form>
</Modal>;
```

**After (new Modal):**

```jsx
import Modal from 'imports/ui/core/Modal';

<Modal
  isOpen={isOpen}
  title="Edit Item"
  onClose={handleClose}
  confirmText="Save"
  onConfirm={handleSave}
  cancelText="Cancel"
  onCancel={handleCancel}
>
  <form>...</form>
</Modal>;
```

### 3. Modal without footer

**Before:**

```jsx
<ConfirmModal
  visible={isOpen}
  title="Info"
  hideFooter={true}
  onCancel={handleClose}
>
  Information only modal
</ConfirmModal>
```

**After:**

```jsx
<Modal
  isOpen={isOpen}
  title="Info"
  hideFooter={true}
  onClose={handleClose}
>
  Information only modal
</Modal>
```

## Prop Mapping

| Old ConfirmModal | Old Modal                | New Modal             | Notes |
| ---------------- | ------------------------ | --------------------- | ----- |
| `visible`        | `isOpen`                 | `isOpen`              | ✅    |
| `title`          | `title`                  | `title`               | ✅    |
| `onCancel`       | `onSecondaryButtonClick` | `onCancel`            | ✅    |
| `onConfirm`      | `onActionButtonClick`    | `onConfirm`           | ✅    |
| `confirmText`    | `actionButtonLabel`      | `confirmText`         | ✅    |
| `cancelText`     | `secondaryButtonLabel`   | `cancelText`          | ✅    |
| `hideFooter`     | -                        | `hideFooter`          | ✅    |
| `onOverlayClick` | -                        | `closeOnOverlayClick` | ✅    |
| -                | `isCentered`             | `isCentered`          | ✅    |
| -                | `scrollBehavior`         | Built-in              | ✅    |
| -                | `contentProps`           | `className`           | ✅    |

## Additional Features

### Custom Sizing

```jsx
<Modal
  isOpen={isOpen}
  size="lg" // 'sm', 'md', 'lg', 'xl', 'full'
  maxWidth="800px"
  maxHeight="600px"
>
  Content
</Modal>
```

### Custom Styling

```jsx
<Modal
  isOpen={isOpen}
  className="custom-modal"
  overlayClassName="custom-overlay"
  headerClassName="custom-header"
  bodyClassName="custom-body"
  footerClassName="custom-footer"
>
  Content
</Modal>
```

### Behavior Control

```jsx
<Modal
  isOpen={isOpen}
  closeOnOverlayClick={false}
  closeOnEscape={false}
  isCentered={false}
>
  Content
</Modal>
```

## CSS Import

Make sure to import the modal styles in your main CSS file:

```css
@import 'imports/ui/core/modal.css';
```

Or add the styles to your existing CSS file.

## Breaking Changes

1. **Prop names changed:**

   - `visible` → `isOpen`
   - `actionButtonLabel` → `confirmText`
   - `secondaryButtonLabel` → `cancelText`
   - `onActionButtonClick` → `onConfirm`
   - `onSecondaryButtonClick` → `onCancel`

2. **Default behavior:**

   - Modals are centered by default
   - Footer shows when `confirmText` or `cancelText` is provided
   - Overlay click closes modal by default
   - Escape key closes modal by default

3. **Styling:**
   - Uses Tailwind CSS classes instead of Chakra UI props
   - Custom styling via className props instead of style objects

## Testing Checklist

After migration, verify:

- [ ] Modal opens and closes correctly
- [ ] Overlay click works as expected
- [ ] Escape key closes modal
- [ ] Body scroll is prevented when modal is open
- [ ] Buttons work correctly
- [ ] Responsive design works on mobile
- [ ] Custom styling applies correctly
- [ ] Accessibility features work (focus management, ARIA labels)

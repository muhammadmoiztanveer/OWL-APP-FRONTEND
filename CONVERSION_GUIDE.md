# Conversion Guide: Laravel Blade to Next.js

This guide helps you convert the remaining Laravel Blade templates to Next.js pages.

## Quick Reference

### Blade to JSX Syntax Mapping

| Blade | Next.js/React |
|-------|---------------|
| `@extends('layouts.master')` | Use `app/(dashboard)/layout.tsx` |
| `@section('content')` | Return JSX directly |
| `{{ $variable }}` | `{variable}` |
| `@if ($condition)` | `{condition && ...}` or `{condition ? ... : ...}` |
| `@foreach ($items as $item)` | `{items.map(item => ...)}` |
| `@lang('translation.key')` | Hardcode text or use i18n |
| `{{ URL::asset('/path') }}` | `/path` (public folder) |
| `@include('component')` | `import Component from '@/components/...'` |
| `@yield('script')` | Use `useEffect` or `Script` component |
| `{{ route('name') }}` | `/path` or use Next.js routing |
| `{{ csrf_field() }}` | Not needed (handled by Next.js) |
| `{{ old('field') }}` | Use React state |

## Step-by-Step Conversion Process

### 1. Create Page File

Create a new file in the appropriate directory:
- Dashboard pages: `app/(dashboard)/your-page/page.tsx`
- Auth pages: `app/(auth)/your-page/page.tsx`
- Public pages: `app/your-page/page.tsx`

### 2. Convert Template Structure

**Before (Blade):**
```blade
@extends('layouts.master')
@section('title') Page Title @endsection
@section('content')
<div class="container-fluid">
    @component('common-components.breadcrumb')
    @slot('pagetitle') Minible @endslot
    @slot('title') Page Title @endslot
    @endcomponent
    
    <!-- Content here -->
</div>
@endsection
```

**After (Next.js):**
```tsx
'use client'
import Breadcrumb from '@/components/common/Breadcrumb'

export default function YourPage() {
  return (
    <>
      <Breadcrumb pagetitle="Minible" title="Page Title" />
      {/* Content here */}
    </>
  )
}
```

### 3. Convert PHP Logic

**Before:**
```blade
@php
    $items = ['item1', 'item2', 'item3'];
@endphp
@foreach($items as $item)
    <div>{{ $item }}</div>
@endforeach
```

**After:**
```tsx
const items = ['item1', 'item2', 'item3']
return (
  <>
    {items.map((item, index) => (
      <div key={index}>{item}</div>
    ))}
  </>
)
```

### 4. Handle Forms

**Before:**
```blade
<form method="POST" action="{{ route('submit') }}">
    @csrf
    <input type="text" name="name" value="{{ old('name') }}">
    <button type="submit">Submit</button>
</form>
```

**After:**
```tsx
const [name, setName] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Handle form submission
}

return (
  <form onSubmit={handleSubmit}>
    <input 
      type="text" 
      name="name" 
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <button type="submit">Submit</button>
  </form>
)
```

### 5. Handle Scripts

**Before:**
```blade
@section('script')
<script src="{{ URL::asset('/assets/js/pages/page.init.js') }}"></script>
@endsection
```

**After:**
```tsx
useEffect(() => {
  // Initialize scripts
  if (typeof window !== 'undefined') {
    // Your initialization code
  }
}, [])
```

Or use Next.js Script component:
```tsx
import Script from 'next/script'

<Script src="/assets/js/pages/page.init.js" strategy="lazyOnload" />
```

### 6. Convert Images

**Before:**
```blade
<img src="{{ URL::asset('/assets/images/logo.png') }}" alt="Logo">
```

**After:**
```tsx
import Image from 'next/image'

<Image src="/assets/images/logo.png" alt="Logo" width={100} height={50} />
```

### 7. Convert Links

**Before:**
```blade
<a href="{{ url('dashboard') }}">Dashboard</a>
```

**After:**
```tsx
import Link from 'next/link'

<Link href="/dashboard">Dashboard</Link>
```

### 8. Handle Charts

**Before:**
```blade
<div id="chart"></div>
<script>
    var options = {...};
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
</script>
```

**After:**
```tsx
'use client'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const options = {...}
const series = [...]

<Chart options={options} series={series} type="line" height={350} />
```

### 9. Handle DataTables

**Before:**
```blade
<table id="datatable" class="table table-bordered dt-responsive nowrap">
</table>
<script>
    $('#datatable').DataTable();
</script>
```

**After:**
```tsx
useEffect(() => {
  if (typeof window !== 'undefined' && (window as any).jQuery) {
    const $ = (window as any).jQuery
    if ($.fn.DataTable) {
      $('#datatable').DataTable()
    }
  }
}, [])
```

### 10. Handle Modals and Dropdowns

Bootstrap modals and dropdowns work the same, but ensure Bootstrap JS is loaded:
- Already included in `components/layouts/Scripts.tsx`
- Use `data-bs-toggle` and `data-bs-target` attributes

## Common Patterns

### Conditional Rendering
```tsx
{isLoggedIn && <div>Content</div>}
{status === 'active' ? <ActiveComponent /> : <InactiveComponent />}
```

### Lists
```tsx
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

### Event Handlers
```tsx
<button onClick={() => handleClick()}>Click</button>
<input onChange={(e) => setValue(e.target.value)} />
<form onSubmit={handleSubmit}>
```

### Dynamic Classes
```tsx
<div className={`card ${isActive ? 'active' : ''}`}>
<div className={clsx('card', { active: isActive })}>
```

## File Organization

### Pages Structure
```
app/
├── (dashboard)/          # Protected routes
│   ├── dashboard/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   ├── ecommerce/
│   ├── apps/
│   ├── pages/
│   └── layouts/
└── (auth)/              # Auth routes
    ├── login/
    ├── register/
    └── recover-password/
```

## Testing Your Conversion

1. **Check routing**: Navigate to the page URL
2. **Check layout**: Ensure sidebar, topbar, footer appear
3. **Check functionality**: Test interactive elements
4. **Check scripts**: Ensure page-specific scripts load
5. **Check styling**: Verify all styles apply correctly
6. **Check responsive**: Test on different screen sizes

## Tips

1. **Start simple**: Convert static pages first
2. **Test incrementally**: Convert and test one page at a time
3. **Reuse components**: Extract common patterns into components
4. **Use TypeScript**: Add proper types for better development experience
5. **Handle loading states**: Use React state for async operations
6. **Optimize images**: Use Next.js Image component
7. **Lazy load**: Use dynamic imports for heavy components

## Need Help?

- Check existing converted pages for reference
- Review Next.js documentation: https://nextjs.org/docs
- Review React documentation: https://react.dev


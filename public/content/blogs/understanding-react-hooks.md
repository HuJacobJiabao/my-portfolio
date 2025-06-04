# Understanding React Hooks

## Introduction

React Hooks revolutionized how we write React components. They allow us to use state and other React features in functional components, making our code more concise and easier to understand.

## The Most Common Hooks

### useState
The `useState` hook is probably the first hook most developers learn. It allows you to add state to functional components:

```javascript
const [count, setCount] = useState(0);
```

### useEffect
The `useEffect` hook lets you perform side effects in function components. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined:

```javascript
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

### useContext
For sharing data between components without prop drilling:

```javascript
const theme = useContext(ThemeContext);
```

## Custom Hooks

One of the most powerful features of hooks is the ability to create your own custom hooks. They let you extract component logic into reusable functions.

### Example: useLocalStorage

```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

## Best Practices

1. **Rules of Hooks**: Always call hooks at the top level of your function
2. **Dependency Arrays**: Be careful with useEffect dependencies
3. **Custom Hooks**: Extract complex logic into custom hooks
4. **Performance**: Use useMemo and useCallback when needed, but don't overuse them

## Conclusion

React Hooks have made React development more enjoyable and powerful. They encourage better separation of concerns and make it easier to share logic between components.

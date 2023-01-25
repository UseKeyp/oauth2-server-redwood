/**
 * Handles text input
 * @param {string} placeholder: A string that will be rendered as placeholder text
 * @param {string} variant: TailwindCSS classes that will be applied to the component
 * @param {string} value: The value of the input
 * @param {string} size: Options: small, regular (Default)
 **/
const TextInput = (props) => {
  return (
    <input
      type="text"
      onChange={props.onChange}
      className={`${props.value} w-full ${
        props.size === 'small' ? 'h-[32px]' : 'h-[48px]'
      } leading-5.6 ease-soft focus:shadow-soft-sm relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding pl-4 pr-3 text-sm text-gray-700 transition-all placeholder:text-gray-300 focus:border-green-400 focus:outline-none focus:transition-shadow ${
        props.variant
      }`}
      value={props.value}
      readOnly={props.readOnly}
      disabled={props.disabled}
      placeholder={props.placeholder}
      id={props.id}
    />
  )
}

export default TextInput

import { type FormEvent, useState } from 'react'

interface BirthdayFormProps {
  initialValue?: string
  onSubmit: (birthday: string) => void
  error?: string
}

export function BirthdayForm({ initialValue = '', onSubmit, error }: BirthdayFormProps) {
  const [birthday, setBirthday] = useState(initialValue)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit(birthday)
  }

  return (
    <form className="birthday-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="birthday">西元生日</label>
      <div className="birthday-form__row">
        <input
          id="birthday"
          name="birthday"
          type="date"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
          aria-describedby={error ? 'birthday-error' : undefined}
          aria-invalid={Boolean(error)}
        />
        <button className="button button--primary" type="submit">啟動解析</button>
      </div>
      {error && <p id="birthday-error" className="form-error" role="alert">{error}</p>}
    </form>
  )
}

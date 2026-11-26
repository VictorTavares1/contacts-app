/**
 * Contacts data layer.
 * The only module that touches localStorage, so the storage
 * mechanism can be swapped (e.g. for an API) without changing the views.
 */

const STORAGE_KEY = 'contacts'

const NAME_MIN_LENGTH = 6 // Spec: name length must be greater than 5.
const CONTACT_PATTERN = /^\d{9}$/ // Exactly 9 digits, nothing else.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    // Corrupted data should not break the app.
    return []
  }
}

function writeContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
}

// Single place for input cleanup, used both when validating and saving,
// so " John@Mail.com " and "john@mail.com" are treated as the same email.
function normalize(data) {
  return {
    name: String(data.name ?? '').trim(),
    contact: String(data.contact ?? '').trim(),
    email: String(data.email ?? '').trim().toLowerCase(),
    picture: data.picture ?? '',
  }
}

export function getAll() {
  return readContacts()
}

export function getById(id) {
  // Route params are strings; stored ids are numbers.
  return readContacts().find((contact) => contact.id === Number(id)) ?? null
}

export function create(data) {
  // Date.now() never repeats an id, even after deletions.
  const contact = { id: Date.now(), ...normalize(data) }
  writeContacts([...readContacts(), contact])
  return contact
}

export function update(id, data) {
  const contactId = Number(id)
  const updated = { id: contactId, ...normalize(data) }
  writeContacts(
    readContacts().map((contact) => (contact.id === contactId ? updated : contact)),
  )
  return updated
}

export function remove(id) {
  const contactId = Number(id)
  writeContacts(readContacts().filter((contact) => contact.id !== contactId))
}

/**
 * Validates contact data.
 * @param {object} data - Form values (name, contact, email, picture).
 * @param {number|string|null} currentId - Id of the contact being edited, or null when creating.
 * @returns {object} Field errors keyed by field name; empty when valid.
 */
export function validate(data, currentId = null) {
  const { name, contact, email, picture } = normalize(data)
  const errors = {}

  if (name.length < NAME_MIN_LENGTH) {
    errors.name = 'Name must have more than 5 characters.'
  }
  if (!CONTACT_PATTERN.test(contact)) {
    errors.contact = 'Contact must have exactly 9 digits.'
  }
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!picture) {
    errors.picture = 'A picture is required.'
  }

  // When editing, exclude the contact itself from the uniqueness check.
  const otherContacts = readContacts().filter((item) => item.id !== Number(currentId))

  // Only check uniqueness when the format is valid, to show one error per field.
  if (!errors.contact && otherContacts.some((item) => item.contact === contact)) {
    errors.contact = 'This contact number is already in use.'
  }
  if (!errors.email && otherContacts.some((item) => item.email === email)) {
    errors.email = 'This email address is already in use.'
  }

  return errors
}
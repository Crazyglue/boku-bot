/**
 * Removes _all_ the users from given text
 *
 * @example '@bradbot @boku now kiss meme' -> 'now kiss meme'
 * @param text string
 */
export default function removeUsers(text: string) {
    return text.replace(/(\<\@\w+\>)+/g, '').trim()
}
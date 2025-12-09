import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  // PUBLIC_INTERFACE
  /**
   * Simple button that toggles label on Enter. Avoids ternary in template by precomputing labelText.
   */
  template: `
      <Element>
          <Text :content="$labelText"></Text>
      </Element>
    `,
  state() {
    return {
      isFavorited: false,
      favoriteText: 'Press Enter',
      unfavoriteText: 'Press Enter Again',
      labelText: 'Press Enter',
    }
  },
  watchers: {
    isFavorited(newVal) {
      this.labelText = newVal ? this.unfavoriteText : this.favoriteText
    }
  },
  input: {
    enter() {
      this.isFavorited = !this.isFavorited
    },
  },
  onInit() {
    // Initialize label based on default state
    this.$watchers.isFavorited.call(this, this.isFavorited)
  }
})

# Changelog 2.2.0

Con la versione 2.2.0 abbiamo:

- Rimosso `apiKey` da `IContentChefConfiguration` e sposato in `onlineChannel` e `previewChannel` in quanto saranno due diverse api key
- In `IContentChefConfiguration`, `host` è diventato opzionale e di default sarà `https://api.contentchef.io` mentre `spaceId` ora è indicato come required
- Per quanto riguarda i media abbiamo aggiunto un metodo che crea la url della risorsa dato un publicId e il `cloud_name` è `contentchef`
- `apiKey` dovrà essere passato in un header dal nome `XXXXXX`
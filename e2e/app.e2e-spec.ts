import { Ngcli20161115Page } from './app.po';

describe('ngcli20161115 App', function() {
  let page: Ngcli20161115Page;

  beforeEach(() => {
    page = new Ngcli20161115Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

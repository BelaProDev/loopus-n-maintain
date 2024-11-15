import { client } from './client';
import { WhatsAppNumbers, NavigationLink } from './types';

export const settingsQueries = {
  getWhatsAppNumbers: async (): Promise<WhatsAppNumbers> => {
    const result = await client.query({
      query: `
        Query(
          Let(
            {
              numbers: First(Collection("whatsapp_numbers"))
            },
            {
              electrics: Select(["data", "electrics"], Var("numbers"), ""),
              plumbing: Select(["data", "plumbing"], Var("numbers"), ""),
              ironwork: Select(["data", "ironwork"], Var("numbers"), ""),
              woodwork: Select(["data", "woodwork"], Var("numbers"), ""),
              architecture: Select(["data", "architecture"], Var("numbers"), "")
            }
          )
        )
      `
    });
    return result.data;
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers): Promise<void> => {
    await client.query({
      query: `
        Let(
          {
            doc: First(Collection("whatsapp_numbers"))
          },
          If(
            IsNull(Var("doc")),
            Create(Collection("whatsapp_numbers"), { data: ${JSON.stringify(numbers)} }),
            Update(Select(["ref"], Var("doc")), { data: ${JSON.stringify(numbers)} })
          )
        )
      `
    });
  },

  getNavigationLinks: async (): Promise<NavigationLink[]> => {
    const result = await client.query({
      query: `
        Map(
          Documents(Collection("navigation_links")),
          Lambda(
            "link",
            Let(
              {
                data: Select(["data"], Get(Var("link")))
              },
              {
                label: Select(["label"], Var("data")),
                url: Select(["url"], Var("data")),
                location: Select(["location"], Var("data"))
              }
            )
          )
        )
      `
    });
    return result.data;
  },

  updateNavigationLink: async (link: NavigationLink): Promise<void> => {
    await client.query({
      query: `
        Create(Collection("navigation_links"), {
          data: ${JSON.stringify(link)}
        })
      `
    });
  }
};
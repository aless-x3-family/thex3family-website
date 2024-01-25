import React from "react"
import { ListItem, UnorderedList } from "@chakra-ui/react"

import InlineLink from "@/components/Link"
import Translation from "@/components/Translation"

import docLinks from "@/data/docs-links.yaml"

export interface IProps {
  headerId: string
}

const DeveloperDocsLinks: React.FC<IProps> = ({ headerId }) => (
  <React.Fragment>
    {docLinks
      .filter(({ id }) => id.includes(headerId))
      .map(({ items, id }) => (
        <UnorderedList ms={6} spacing={3} key={id}>
          {items &&
            items.map(({ id, to, path, description, items }) => (
              <ListItem key={id}>
                {to || path ? (
                  <InlineLink to={to || path}>
                    <Translation id={`page-docs:${id}`} />
                  </InlineLink>
                ) : (
                  <Translation id={`page-docs:${id}`} />
                )}
                <i>
                  {" – "}
                  <Translation id={`page-docs:${description}`} />
                </i>
                <UnorderedList
                  ms={6}
                  mt={3}
                  spacing={3}
                  style={{ listStyleType: "circle" }}
                >
                  {items &&
                    items.map(({ id, to, path }) => (
                      <ListItem key={id}>
                        <InlineLink to={to || path}>
                          <Translation id={`page-docs:${id}`} />
                        </InlineLink>
                      </ListItem>
                    ))}
                </UnorderedList>
              </ListItem>
            ))}
        </UnorderedList>
      ))}
  </React.Fragment>
)

export default DeveloperDocsLinks

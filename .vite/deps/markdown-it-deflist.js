import "./chunk-G3PMV62Z.js";

// node_modules/markdown-it-deflist/index.mjs
function deflist_plugin(md) {
  const isSpace = md.utils.isSpace;
  function skipMarker(state, line) {
    let start = state.bMarks[line] + state.tShift[line];
    const max = state.eMarks[line];
    if (start >= max) {
      return -1;
    }
    const marker = state.src.charCodeAt(start++);
    if (marker !== 126 && marker !== 58) {
      return -1;
    }
    const pos = state.skipSpaces(start);
    if (start === pos) {
      return -1;
    }
    if (pos >= max) {
      return -1;
    }
    return start;
  }
  function markTightParagraphs(state, idx) {
    const level = state.level + 2;
    for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
      if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
        state.tokens[i + 2].hidden = true;
        state.tokens[i].hidden = true;
        i += 2;
      }
    }
  }
  function deflist(state, startLine, endLine, silent) {
    if (silent) {
      if (state.ddIndent < 0) {
        return false;
      }
      return skipMarker(state, startLine) >= 0;
    }
    let nextLine = startLine + 1;
    if (nextLine >= endLine) {
      return false;
    }
    if (state.isEmpty(nextLine)) {
      nextLine++;
      if (nextLine >= endLine) {
        return false;
      }
    }
    if (state.sCount[nextLine] < state.blkIndent) {
      return false;
    }
    let contentStart = skipMarker(state, nextLine);
    if (contentStart < 0) {
      return false;
    }
    const listTokIdx = state.tokens.length;
    let tight = true;
    const token_dl_o = state.push("dl_open", "dl", 1);
    const listLines = [startLine, 0];
    token_dl_o.map = listLines;
    let dtLine = startLine;
    let ddLine = nextLine;
    OUTER:
      for (; ; ) {
        let prevEmptyEnd = false;
        const token_dt_o = state.push("dt_open", "dt", 1);
        token_dt_o.map = [dtLine, dtLine];
        const token_i = state.push("inline", "", 0);
        token_i.map = [dtLine, dtLine];
        token_i.content = state.getLines(dtLine, dtLine + 1, state.blkIndent, false).trim();
        token_i.children = [];
        state.push("dt_close", "dt", -1);
        for (; ; ) {
          const token_dd_o = state.push("dd_open", "dd", 1);
          const itemLines = [nextLine, 0];
          token_dd_o.map = itemLines;
          let pos = contentStart;
          const max = state.eMarks[ddLine];
          let offset = state.sCount[ddLine] + contentStart - (state.bMarks[ddLine] + state.tShift[ddLine]);
          while (pos < max) {
            const ch = state.src.charCodeAt(pos);
            if (isSpace(ch)) {
              if (ch === 9) {
                offset += 4 - offset % 4;
              } else {
                offset++;
              }
            } else {
              break;
            }
            pos++;
          }
          contentStart = pos;
          const oldTight = state.tight;
          const oldDDIndent = state.ddIndent;
          const oldIndent = state.blkIndent;
          const oldTShift = state.tShift[ddLine];
          const oldSCount = state.sCount[ddLine];
          const oldParentType = state.parentType;
          state.blkIndent = state.ddIndent = state.sCount[ddLine] + 2;
          state.tShift[ddLine] = contentStart - state.bMarks[ddLine];
          state.sCount[ddLine] = offset;
          state.tight = true;
          state.parentType = "deflist";
          state.md.block.tokenize(state, ddLine, endLine, true);
          if (!state.tight || prevEmptyEnd) {
            tight = false;
          }
          prevEmptyEnd = state.line - ddLine > 1 && state.isEmpty(state.line - 1);
          state.tShift[ddLine] = oldTShift;
          state.sCount[ddLine] = oldSCount;
          state.tight = oldTight;
          state.parentType = oldParentType;
          state.blkIndent = oldIndent;
          state.ddIndent = oldDDIndent;
          state.push("dd_close", "dd", -1);
          itemLines[1] = nextLine = state.line;
          if (nextLine >= endLine) {
            break OUTER;
          }
          if (state.sCount[nextLine] < state.blkIndent) {
            break OUTER;
          }
          contentStart = skipMarker(state, nextLine);
          if (contentStart < 0) {
            break;
          }
          ddLine = nextLine;
        }
        if (nextLine >= endLine) {
          break;
        }
        dtLine = nextLine;
        if (state.isEmpty(dtLine)) {
          break;
        }
        if (state.sCount[dtLine] < state.blkIndent) {
          break;
        }
        ddLine = dtLine + 1;
        if (ddLine >= endLine) {
          break;
        }
        if (state.isEmpty(ddLine)) {
          ddLine++;
        }
        if (ddLine >= endLine) {
          break;
        }
        if (state.sCount[ddLine] < state.blkIndent) {
          break;
        }
        contentStart = skipMarker(state, ddLine);
        if (contentStart < 0) {
          break;
        }
      }
    state.push("dl_close", "dl", -1);
    listLines[1] = nextLine;
    state.line = nextLine;
    if (tight) {
      markTightParagraphs(state, listTokIdx);
    }
    return true;
  }
  md.block.ruler.before("paragraph", "deflist", deflist, { alt: ["paragraph", "reference", "blockquote"] });
}
export {
  deflist_plugin as default
};
//# sourceMappingURL=markdown-it-deflist.js.map

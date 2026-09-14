import React, { useState } from "react";
import { X, BookOpen, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileText, CheckCircle2 } from "lucide-react";

export default function SoftcopyViewerModal({ book, onClose }) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 24;

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1264E8] text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                {book.name}
              </h3>
              <p className="text-xs text-gray-500">
                Author: {book.author} • Shelf: {book.shelfNumber} • Digital Library Repository
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((prev) => Math.max(75, prev - 15))}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-gray-500 w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((prev) => Math.min(150, prev + 15))}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 flex justify-center">
          <div
            className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-2xl w-full p-8 sm:p-12 transition-all duration-150 leading-relaxed text-gray-800"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            {/* Header of the document page */}
            <div className="border-b pb-4 mb-6 flex items-center justify-between text-xs text-gray-400">
              <span>VIGNAN DIGITAL LIBRARY REPOSITORY</span>
              <span>ISBN: {book.isbn}</span>
            </div>

            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1264E8]">
                {book.subject} — {book.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                {book.name}
              </h1>
              <p className="text-sm font-medium text-gray-600 mt-1">
                By {book.author}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {book.publisher} • {book.edition}
              </p>
            </div>

            {/* Simulated Textbook Excerpt */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="text-sm font-bold text-gray-900 border-b pb-1">
                Chapter 6: Binary Trees and Recursive Traversals
              </h2>
              <p>
                A <strong>binary tree</strong> is a hierarchical finite set of elements called nodes. A tree has a distinguished node called the <em>root</em>, and every node has at most two children termed the left child and right child.
              </p>
              <p>
                <strong>Depth-First Traversals:</strong> Unlike linear data structures such as arrays and linked lists, which are traversed in linear order, trees may be traversed in multiple recursive ways:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Preorder (Root, Left, Right)</strong>: Useful for copying or cloning trees.</li>
                <li><strong>Inorder (Left, Root, Right)</strong>: In a binary search tree (BST), inorder traversal yields sorted ascending keys.</li>
                <li><strong>Postorder (Left, Right, Root)</strong>: Critical for deleting subtrees from the bottom up before freeing parent nodes.</li>
              </ul>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl my-4 text-xs text-blue-900">
                <strong>Faculty Study Note:</strong> Focus on stack activation records unwinding upon reaching <code>NULL</code> base condition pointers.
              </div>
              <p>
                <strong>Space Complexity:</strong> The recursion stack depth is bounded by the height of the tree, giving <code>O(h)</code> space complexity, which is <code>O(log n)</code> for balanced binary trees and <code>O(n)</code> in degenerate skewed trees.
              </p>
            </div>

            <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
              Page {currentPage} of {totalPages} • Official Academic Institutional Resource
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-gray-700">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Softcopy Access
            </span>
            <button
              onClick={() => alert("Institutional download logged for offline reading.")}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

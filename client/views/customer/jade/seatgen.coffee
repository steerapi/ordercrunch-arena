text = """
ul#seat(data-role="none", style="display:none;")
"""
for x in [1..3]
  text+="""
  
    li(data-val='#{x}') 
      | #{x}
  """
  for y in [0..9]
    text+="""
  
      ul
        li(data-val='#{y}')
          | #{y}
          ul
    """
    for z in [0..9]
      text+="""
    
            li(data-val='#{z}') #{z}
      """
      
console.log text
